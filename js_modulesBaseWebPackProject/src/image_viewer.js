//import big from '../assets/big.jpg';
import small from '../assets/small.jpg';
import '../styles/image_viewer.css';

export default () => {

    const image = document.createElement('img');
    //image.src = "http://lorempixel.com/400/400";
    image.src = small;

    document.body.appendChild(image);

    /*
    const imageBig = document.createElement('img');
    imageBig.src = big;
    
    document.body.appendChild(imageBig);*/
}