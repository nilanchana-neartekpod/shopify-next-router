import React from "react";
import ImageGallery from "react-image-gallery";

const images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

export class MyGallery extends React.Component {
  render() {
    const { imagesArray, galleryTitle } = this.props;
    return (
      <ImageGallery
        lazyLoad={true}
        items={imagesArray}
        thumbnailPosition={"left"}
        showFullscreenButton={false}
        showPlayButton={false}
        showNav={false}
        showBullets={true}
      />
    );
  }
}
