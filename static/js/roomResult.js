import { createObjViewer } from "./OBJViewer.js";

// img+obj
const allPairs = [
    ["./static/rooms/all/cca746ee-8e5d-42d5-9e00-4f09c06bb31a.jpg", "./static/rooms/all/cca746ee-8e5d-42d5-9e00-4f09c06bb31a_box.obj", "./static/rooms/all/cca746ee-8e5d-42d5-9e00-4f09c06bb31a.obj"],
    ["./static/rooms/all/65b410a8-626a-4b6c-919a-3edd1f256760.jpg", "./static/rooms/all/65b410a8-626a-4b6c-919a-3edd1f256760_box.obj", "./static/rooms/all/65b410a8-626a-4b6c-919a-3edd1f256760.obj"],
]

// img+obj
const boxPairs = [
    ["./static/rooms/boxOnly/0c2cf150-5293-43d7-acbf-8c1b0a67070a.jpg", "./static/rooms/boxOnly/0c2cf150-5293-43d7-acbf-8c1b0a67070a.obj"],
    ["./static/rooms/boxOnly/3f6df3ff-611d-4259-a65f-57641b3e993e.jpg", "./static/rooms/boxOnly/3f6df3ff-611d-4259-a65f-57641b3e993e.obj"],
    ["./static/rooms/boxOnly/5749ee9f-3274-44c5-aaf2-114d2f4f4391.jpg", "./static/rooms/boxOnly/5749ee9f-3274-44c5-aaf2-114d2f4f4391.obj"],
    ["./static/rooms/boxOnly/57638f14-c201-43bd-86f8-56fffa63e917.jpg", "./static/rooms/boxOnly/57638f14-c201-43bd-86f8-56fffa63e917.obj"],
    ["./static/rooms/boxOnly/656408d1-43cb-4ef5-93d6-f8df441a49a3.jpg", "./static/rooms/boxOnly/656408d1-43cb-4ef5-93d6-f8df441a49a3.obj"],
    ["./static/rooms/boxOnly/54647521-1e76-42a3-bfea-f7aac8f9221b.jpg", "./static/rooms/boxOnly/54647521-1e76-42a3-bfea-f7aac8f9221b.obj"],
    ["./static/rooms/boxOnly/56060996-9052-4f8d-a730-b55bce0ea56b.jpg", "./static/rooms/boxOnly/56060996-9052-4f8d-a730-b55bce0ea56b.obj"],
    ["./static/rooms/boxOnly/b85a0c5e-43ed-4e31-9679-20a3e78b229f.jpg", "./static/rooms/boxOnly/b85a0c5e-43ed-4e31-9679-20a3e78b229f.obj"],
    ["./static/rooms/boxOnly/ba13101c-01ff-41e2-be9b-aaabbeed1c6f.jpg", "./static/rooms/boxOnly/ba13101c-01ff-41e2-be9b-aaabbeed1c6f.obj"],
    ["./static/rooms/boxOnly/cca746ee-8e5d-42d5-9e00-4f09c06bb31a.jpg", "./static/rooms/boxOnly/cca746ee-8e5d-42d5-9e00-4f09c06bb31a.obj"],
    ["./static/rooms/boxOnly/cdd84514-2dcf-41a8-8404-de480f15508a.jpg", "./static/rooms/boxOnly/cdd84514-2dcf-41a8-8404-de480f15508a.obj"],
]

const viewerElementIdPairs = [
    ["floorplan-viewer-1", "room-viewer-1"],
    ["floorplan-viewer-2", "room-viewer-2"],
]

const allViewerElementIdPairs = [
    ["floorplan-viewer-3", "room-viewer-3", "room-viewer-4"],
]

const fovLeftButtonId = "fov-container-left";
const fovRightButtonId = "fov-container-right";
const foovNextButtonId = "foov-container-next";

function addRoomResult(){
    const fovLeftButton = document.getElementById(fovLeftButtonId);
    const fovRightButton = document.getElementById(fovRightButtonId);
    const foovNextButton = document.getElementById(foovNextButtonId);

    const viewerPairs = viewerElementIdPairs.map((item) => {
        const imgViewer = document.getElementById(item[0]);
        const objViewer = document.getElementById(item[1]);
        return {imgViewer, objViewer};
    });
    const allViewerPairs = allViewerElementIdPairs.map((item) => {
        const imgViewer = document.getElementById(item[0]);
        const boxViewer = document.getElementById(item[1]);
        const objViewer = document.getElementById(item[2]);
        return {imgViewer, boxViewer, objViewer};
    });

    const objPairAmount = boxPairs.length;
    const allObjPairAmount = allPairs.length;
    const viewerPairAmount = viewerPairs.length;
    const allViewerPairAmount = allViewerPairs.length;
    const viewerPairInfo = new Array(viewerPairAmount).fill(null);
    const allViewerPairInfo = new Array(allViewerPairAmount).fill(null);
    let currentStartDisplayIdx = 0;
    let currentAllStartDisplayIdx = 0;

    const updateFov = () => {
        for(let i = 0; i < viewerPairAmount; i++){
            const objPair = boxPairs.at((currentStartDisplayIdx + i) % objPairAmount);
            if(viewerPairInfo[i] === null){
                const {imgViewer, objViewer} = viewerPairs[i];

                imgViewer.src = objPair[0];
                const objViewerInfo = createObjViewer(
                    objViewer, objPair[1], {disableRecolor: true, autoRotateSpeed: 0.0, fov: 32}
                );
                viewerPairInfo[i]={
                    img: imgViewer,
                    obj: objViewerInfo,
                }
            }
            else{
                viewerPairInfo[i].img.src = objPair[0];
                viewerPairInfo[i].obj.update(objPair[1]);
            }
        }
    };
    
    const updateFoov = () => {
        for(let i = 0; i < allViewerPairAmount; i++){
            const objPair = allPairs.at((currentAllStartDisplayIdx + i) % allObjPairAmount);
            if(allViewerPairInfo[i] === null){
                const {imgViewer, boxViewer, objViewer} = allViewerPairs[i];

                imgViewer.src = objPair[0];
                const boxViewerInfo = createObjViewer(
                    boxViewer, objPair[1], {disableRecolor: true, autoRotateSpeed: 0.0, fov: 32}
                );
                const objViewerInfo = createObjViewer(
                    objViewer, objPair[2], {disableRecolor: true, autoRotateSpeed: 0.0, fov: 32}
                );

                allViewerPairInfo[i]={
                    img: imgViewer,
                    box: boxViewerInfo,
                    obj: objViewerInfo,
                }
            }
            else{
                allViewerPairInfo[i].img.src = objPair[0];
                allViewerPairInfo[i].box.update(objPair[1]);
                allViewerPairInfo[i].obj.update(objPair[2]);
            }
        }
    };

    updateFov();
    updateFoov();

    fovLeftButton.onclick = () => {
        currentStartDisplayIdx += viewerPairAmount;
        currentStartDisplayIdx %= objPairAmount;
        updateFov();
    }

    fovRightButton.onclick = () => {
        currentStartDisplayIdx += objPairAmount - (viewerPairAmount % objPairAmount);
        currentStartDisplayIdx %= objPairAmount;
        updateFov();
    }

    foovNextButton.onclick = () => {
        currentAllStartDisplayIdx += allViewerPairAmount;
        currentAllStartDisplayIdx %= allObjPairAmount;
        updateFoov();
    }
}

export {addRoomResult};