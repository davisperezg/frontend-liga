interface IOptions {
  children: JSX.Element;
}

const Content = ({ children }: IOptions) => {
  return (
    <div
      style={{
        borderRadius: 4,
        fontSize: "1.16em",
        height: "100%",
        marginTop: 30,
        width: "100%",
        flex: "1 1 100%",
        marginBottom: 30,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
};

export default Content;
