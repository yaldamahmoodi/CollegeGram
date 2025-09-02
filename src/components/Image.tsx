import * as React from 'react';

type Props = {
    image: string[];
};

const Image: React.FC<Props> = ({ image }) => {
    if (!image || image.length === 0) return null;

    return (
        <div className="flex gap-3">
            {image.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    className="w-32 h-32 object-cover rounded-md"
                    alt={`Image ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default Image;
