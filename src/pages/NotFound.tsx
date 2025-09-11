import notFound from "@assets/images/notFound.jpeg";
const NotFound = () => {
  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat layout-container bg-[url('/images/404.jpg')]">
      <div className="bg-black/50 h-screen flex items-center justify-center">
        <div className="w-1/2 bg-white p-8 flex items-center justify-center rounded-2xl text-center">
          <img src={notFound} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
