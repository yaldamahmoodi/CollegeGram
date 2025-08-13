const MainAuthLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat layout-container">
      <div className="bg-center bg-opacity-50 h-screen flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default MainAuthLayout;
