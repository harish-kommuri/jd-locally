export default function TextMessage({ text }) {
  if (!text) {
    return null;
  }

  return <pre className="whitespace-pre-wrap font-sans text-sm">{text}</pre>;
}
