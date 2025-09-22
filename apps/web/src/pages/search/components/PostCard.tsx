type PostCardProps = {
  image: string;
};

export default function PostCard({ image }: PostCardProps) {
  return (
    <div className="overflow-hidden rounded-4xl aspect-square ">
      <img src={image} alt="post" className="w-full h-full object-cover" />
    </div>
  );
}
