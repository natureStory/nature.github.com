const totalSkinNum = 7;
const skinNum = window.localStorage.getItem('skinNum');
console.log(skinNum);
let tempSkinNum = `${Math.ceil(Math.random() * totalSkinNum)}`;
if (skinNum === tempSkinNum) {
    if (skinNum< totalSkinNum) {
        tempSkinNum = `${parseInt(tempSkinNum) + 1}`
    } else {
        tempSkinNum = `${parseInt(tempSkinNum) - 1}`
    }
}
window.localStorage.setItem('skinNum', tempSkinNum);
document.body.className = `skin${tempSkinNum}`;