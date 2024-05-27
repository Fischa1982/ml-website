var model;

async function loadModel() {
    model = await tf.loadGraphModel('JSModel/model.json');
}

 function convertTo3DArray(cols, rows, data) {
    counter = 0;
    let two_dim_array = [];
    for (let i = 0; i < rows; i++) {
	    let one_dim_array = [];
        for (let j = 0; j < cols; j++) {
    	    one_dim_array.push(data[counter]);
            counter ++;
        }
  	    two_dim_array.push(one_dim_array);
    };

    return [two_dim_array]
};

function predictImage() {

    // Reading the Image
    let img = cv.imread(canvas);

    // Converting to Balck an dWhite
    cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(img, img, 175, 255, cv.THRESH_BINARY);

    // Finding the Conturs and Cutting
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    img = img.roi(rect);

    // Resizing the Image
    let width = img.cols 
    let height = img.rows 

    if (width > height) {
        scalefactor = width / 20;
        width = 20;
        height = Math.round(height / scalefactor);
    } else {
        scalefactor = height / 20;
        height = 20;
        width = Math.round(width / scalefactor);
    }

    let newSize = new cv.Size(width, height);
    cv.resize(img, img, newSize, 0, 0, cv.INTER_AREA);

    let top = Math.ceil(((20 - height) / 2) + 4);
    let bottom = Math.floor(((20 -height) / 2) + 4);
    let left = Math.ceil(((20 -width) / 2) + 4);
    let right = Math.floor(((20 - width) / 2) + 4);

    let s = new cv.Scalar(0, 0, 0, 255);
    cv.copyMakeBorder(img, img, top, bottom, left, right, cv.BORDER_CONSTANT, s);

    // Shift Image
    let contours_resize = new cv.MatVector();
    let hieracrchy_resize = new cv.Mat();
    cv.findContours(img, contours_resize, hieracrchy_resize, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt_resize = contours_resize.get(0);
    let moments = cv.moments(cnt_resize, false);

    let cx = moments.m10 / moments.m00;
    let cy = moments.m01 / moments.m00;

    const X_SHIFT = Math.round((img.cols / 2) - cx);
    const Y_SHIFT = Math.round((img.rows / 2) - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    let dsize = new cv.Size(img.rows, img.cols);
    cv.warpAffine(img, img, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // Predicting Image
    let pixelData = new Float32Array(img.data);
    pixelData = pixelData.map(function(item) {
        return item / 255.0;
    });

    const myTensor = tf.tensor(convertTo3DArray(img.rows, img.cols, pixelData))
    //model = await tf.loadGraphModel('JSModel/model.json');
    const result = model.predict(myTensor);
    return result

    //predict.then(value => console.log(value))
    
    //console.log(result_arr.indexOf(Math.max(...result_arr)))

    img.delete();
    contours.delete();
    hierarchy.delete();
    contours_resize.delete();
    hieracrchy_resize.delete();
    cnt_resize.delete();
    cnt.delete();
    M.delete();
    myTensor.dispose();
  
}
