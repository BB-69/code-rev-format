const HyperLink = ({ link, text }: { link: string; text?: string }) => {
  if (!text) text = link;

  return (
    <a
      className="underline opacity-90"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
};

export default HyperLink;
