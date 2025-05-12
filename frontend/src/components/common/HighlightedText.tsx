// src/components/common/HighlightedText.tsx

const HighlightedText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
      {children}
    </span>
  );
};

export default HighlightedText;
