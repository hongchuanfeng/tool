const show_view = document.getElementsByClassName('show-view')[0];
const img_show_canvas = document.getElementById('img-show');
const img_input = document.getElementById('img-input');
const pix_color = document.getElementById('pix-color');
//const pix_rgb_hex = document.getElementById('pix-rgb-hex');
const pix_rgb_hex2 = document.getElementById('pix-rgb-hex2');

let imgObj;

/** 打开图片 */
async function openImage(blob) {
    return new Promise((resolve, _) => {
        let img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
            imgObj = img;
            resolve(true);
        }
        img.onerror = () => {
            resolve(false);
        }
    });
}

/** 绘制图片到canvas */
function drawImage() {
    if (imgObj) {
        const ctx = img_show_canvas.getContext('2d');
        const scale = Math.min(img_show_canvas.width / imgObj.width, img_show_canvas.height / imgObj.height);
        const x = (img_show_canvas.width - imgObj.width * scale) / 2;
        const y = (img_show_canvas.height - imgObj.height * scale) / 2;
        ctx.drawImage(imgObj, x, y, imgObj.width * scale, imgObj.height * scale);
    }
}

/** 更新canvas组件的尺寸 */
function resizeCanvas() {
    img_show_canvas.width = show_view.clientWidth - 10;
    img_show_canvas.height = show_view.clientHeight - 10;
}

/** rgb数值转为16进制 */
function rgbToHex(rgb_list) {
    let hex_str = '#';
    for (let i = 0; i < rgb_list.length; i++) {
        hex_str += rgb_list[i].toString(16).padStart(2, '0');
    }
    return hex_str.toUpperCase();
}

/** 文件输入更新检测 */
img_input.onchange = function (e) {
    const files = e.target.files;
    if (files && files.length && files.length > 0) {
        const file = files[0];
        const blob = new Blob([file], { type: file.type });
        openImage(blob).then((state) => {
            console.log('图片加载完毕，状态：', state);
            resizeCanvas();
            drawImage();
        });
    }
}

/** 更新像素颜色 */
function updatePixColor(e) {
    const { clientX, clientY } = e;
    const rect = img_show_canvas.getBoundingClientRect();
    const cur_x = clientX - rect.left * (img_show_canvas.width / rect.width);
    const cur_y = clientY - rect.top * (img_show_canvas.height / rect.height);
    const ctx = img_show_canvas.getContext('2d');
    const data = ctx.getImageData(cur_x, cur_y, 1, 1).data;
    const [r, g, b, a] = data;
    //pix_rgb_hex.innerText = rgbToHex([r, g, b]);
    pix_rgb_hex2.innerText = "rgb(" + r + "," + g + "," + b + ")";
    pix_color.style.backgroundColor = rgbToHex([r, g, b]);
    // console.log(cur_x, cur_y);
    converttoRgb();
}

function converttoRgb() {
    let rgbtxt = document.getElementById('pix-rgb-hex2').innerHTML;

    let rgb = rgbtxt.replace("rgb(", "").replace(")", "").split(",");
    let val = rgbToHex(rgb);
    document.getElementById('pix-rgb-hex3').innerText = val;
}


let canvas_mouse_state = false;
img_show_canvas.addEventListener('mousedown', (e) => {
    canvas_mouse_state = true;
    updatePixColor(e);
});
img_show_canvas.addEventListener('mouseup', (e) => {
    canvas_mouse_state = false;
})

img_show_canvas.addEventListener('mousemove', (e) => {
    if (canvas_mouse_state) {
        updatePixColor(e);
    }
})

/* 网页加载完毕后初始化canvas */
window.onload = function () {
    resizeCanvas()
}
/* 当网页尺寸改变时修改canvas尺寸 */
window.onresize = function () {
    resizeCanvas();
    drawImage();
}