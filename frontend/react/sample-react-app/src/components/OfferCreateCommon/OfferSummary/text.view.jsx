export const TextView = ({ title, content }) => {
  return (
    <div className="gap-x-2 w-full items-center grid grid-cols-2">
      <span className="font-semibold">{title}:</span>
      <span>{content}</span>
    </div>
  );
};
