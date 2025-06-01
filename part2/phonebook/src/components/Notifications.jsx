const Notification = ({ message, isSuccessfull }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={"notification " + (isSuccessfull ? "success" : "error")}>
      {message}
    </div>
  );
};

export default Notification;
