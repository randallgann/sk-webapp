
export default function Avatar({ isOnline, srcImage, textImage }) {
  const onlineStyles =
    "before:absolute before:w-3 before:h-3 before:rounded-full before:bottom-0 before:right-0 before:bg-green-500 before:border-2 before:border-white";

  return (
    <div className={`relative w-12 h-12 shrink-0 ${isOnline && onlineStyles}`}>
      {/* srcImage will need to change from falsy to true value; now it always renders srcImage when srcImage doesn't have URL */}
      {srcImage ? (
        <img
          className="w-full h-full rounded-full overflow-hidden object-cover"
          width="48"
          height="48"
          src={srcImage ?? "/mm-logo-insta.png"}
          alt="Avatar"
        />
      ) : null}

      {!srcImage ? (
        <div className="flex items-center justify-center w-full h-full rounded-full overflow-hidden bg-green-600 text-white">
          {textImage}
        </div>
      ) : null}
    </div>
  );
}
