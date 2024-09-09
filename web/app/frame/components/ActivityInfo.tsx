export function TextBlock({
  text,
  size = '40px',
  margin = '0',
}: {
  text: string;
  size?: string;
  margin?: string;
}) {
  return (
    <p style={{ fontSize: size, fontWeight: 'bold', margin, color: '#FFFFFF', textAlign: 'right' }}>
      {text}
    </p>
  );
}

export function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: '20px',
      }}
    >
      <TextBlock text={title} margin="0 0 5px 0" />
      <TextBlock text={value} />
    </div>
  );
}
