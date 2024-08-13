// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./mock/MockERC20.sol";
import "../src/Challenges.sol";
import "../src/interfaces/IChallenges.sol";

contract ChallengesTest is Test {
    MockERC20 stakingAsset;
    Challenges challenges;
    address governance;
    uint128 initMinDonationBPS = 1_000;
    address treasury;
    address verifier;
    uint256 key;
    uint64 joinDueDays;
    uint64 challengeEndDays;
    uint128 constant PER_USER_STAKE = 100 * 1e6;

    function setUp() public {
        challengeEndDays = 100;
        joinDueDays = 1;

        (verifier, key) = makeAddrAndKey("test_verifier");
        treasury = makeAddr("test_treasury");
        governance = makeAddr("test_governance");

        stakingAsset = new MockERC20("USDC", "USDC", 6);
        challenges = new Challenges("Alibuda Habit Builder", "1.0", governance, initMinDonationBPS);

        stakingAsset.mint(address(this), PER_USER_STAKE);
        stakingAsset.approve(address(challenges), PER_USER_STAKE);
    }

    function _expectRevertNonOwner(address _sender) internal {
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, _sender));
    }

    function _createChallenge() internal {
        vm.prank(governance);
        challenges.setDonationOrgEnabled(treasury, true);
        challenges.create(
            IChallenges.Challenge(
                verifier,
                1,
                uint64(block.timestamp),
                uint64(block.timestamp + joinDueDays * 1 days),
                uint64(block.timestamp + challengeEndDays * 1 days),
                treasury,
                address(0),
                address(stakingAsset),
                6_000,
                PER_USER_STAKE
            )
        );
    }

    function _joinAndCheckIn(bytes calldata checkInData) internal {
        vm.warp(block.timestamp);

        challenges.join(1);

        bytes32 digest = challenges.getCheckInDigest(1, checkInData);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        challenges.checkIn(1, checkInData, abi.encodePacked(r, s, v));
    }

    function test_CreateChallenge() public {
        _createChallenge();
        IChallenges.Challenge memory _challenge = challenges.getChallenge(1);
        assertNotEq(_challenge.startTimestamp, 0, "Create failed");
    }

    function test_Join() public {
        _createChallenge();
        challenges.join(1);
        assertEq(
            uint256(challenges.userStatus(1, address(this))), uint256(IChallenges.UserStatus.Joined), "Join failed"
        );
    }

    function test_RevertWhen_JoinPeriodEnded() public {
        _createChallenge();
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert(IChallenges.InvalidTimestamp.selector);
        challenges.join(1);
    }

    function test_CheckIn(bytes calldata checkInData) public {
        _createChallenge();
        _joinAndCheckIn(checkInData);
        assertEq(challenges.checkIns(1, address(this), 0), checkInData, "Check in failed");
    }

    function test_Settle(bytes calldata checkInData) public {
        _createChallenge();
        _joinAndCheckIn(checkInData);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        assertEq(uint256(challenges.challengeStatus(1)), uint256(IChallenges.ChallengeStatus.Settled), "Settle failed");
        assertEq(challenges.getWinningStakePerUser(1), PER_USER_STAKE, "Settle failed");
    }

    function test_Settle_WhenAllUserFailed() public {
        _createChallenge();
        challenges.join(1);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        assertEq(uint256(challenges.challengeStatus(1)), uint256(IChallenges.ChallengeStatus.Settled), "Settle failed");
        assertEq(challenges.getWinningStakePerUser(1), 0, "Settle failed");
        assertEq(stakingAsset.balanceOf(address(treasury)), PER_USER_STAKE, "fund left in contract");
    }

    function test_Withdraw(address failedUser, bytes calldata checkInData) public {
        vm.assume(failedUser != address(0));
        _createChallenge();
        _joinAndCheckIn(checkInData);

        vm.startPrank(failedUser);
        stakingAsset.mint(failedUser, PER_USER_STAKE);
        stakingAsset.approve(address(challenges), PER_USER_STAKE);
        challenges.join(1);
        vm.stopPrank();

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        uint256 beforeBalance = stakingAsset.balanceOf(address(this));
        challenges.withdraw(1);
        uint256 afterBalance = stakingAsset.balanceOf(address(this));
        IChallenges.Challenge memory _challenge = challenges.getChallenge(1);
        assertEq(
            afterBalance - beforeBalance,
            PER_USER_STAKE + PER_USER_STAKE * (10_000 - _challenge.donationBPS) / 10_000,
            "testing withdraw failed"
        );
        assertEq(stakingAsset.balanceOf(treasury), PER_USER_STAKE * _challenge.donationBPS / 10_000, "donation failed");
        assertEq(stakingAsset.balanceOf(address(challenges)), 0, "fund left in contract");
    }

    function test_FailedUserWithdraw() public {
        _createChallenge();
        challenges.join(1);

        vm.warp(block.timestamp + (challengeEndDays + 1) * 1 days);
        challenges.settle(1);

        vm.expectRevert(IChallenges.UserNotClaimable.selector);
        challenges.withdraw(1);
    }

    function test_UpdateDonationOrgStatus(address donationOrg) public {
        vm.startPrank(governance);
        challenges.setDonationOrgEnabled(donationOrg, true);
        assertEq(challenges.donationOrgsEnabled(donationOrg), true, "updateDonationOrgStatus failed");
    }

    function test_RevertWhen_UpdateDonationOrgStatus_WithInvalidPermission(address donationOrg) public {
        _expectRevertNonOwner(address(this));
        challenges.setDonationOrgEnabled(donationOrg, true);
    }

    function test_RevertWhen_DonationOrgDisabled(address donationOrg) public {
        vm.assume(donationOrg != address(0));
        vm.expectRevert(IChallenges.InvalidPermission.selector);
        challenges.create(
            IChallenges.Challenge(
                verifier,
                1,
                uint64(block.timestamp),
                uint64(block.timestamp + joinDueDays * 1 days),
                uint64(block.timestamp + challengeEndDays * 1 days),
                donationOrg,
                address(0),
                address(stakingAsset),
                0,
                PER_USER_STAKE
            )
        );
    }

    function test_setMinDonationBPS(uint128 minDonationBPS) public {
        vm.startPrank(governance);
        challenges.setMinDonationBPS(minDonationBPS);
        assertEq(challenges.minDonationBPS(), minDonationBPS, "setMinDonationBPS failed");
    }

    function test_RevertWhen_SetMinDonationBP_WithInvalidPermission(uint128 minDonationBPS) public {
        _expectRevertNonOwner(address(this));
        challenges.setMinDonationBPS(minDonationBPS);
    }

    function test_RevertWhen_CreateChallenge_WithBPSTooLow(uint128 minDonationBPS, uint128 donationBPS) public {
        vm.assume(minDonationBPS > donationBPS);
        vm.startPrank(governance);
        challenges.setDonationOrgEnabled(treasury, true);
        challenges.setMinDonationBPS(minDonationBPS);
        vm.expectRevert(IChallenges.InvalidBPS.selector);
        challenges.create(
            IChallenges.Challenge(
                verifier,
                1,
                uint64(block.timestamp),
                uint64(block.timestamp + joinDueDays * 1 days),
                uint64(block.timestamp + challengeEndDays * 1 days),
                treasury,
                address(0),
                address(stakingAsset),
                donationBPS,
                PER_USER_STAKE
            )
        );
    }
}
