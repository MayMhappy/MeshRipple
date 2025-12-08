import { createObjViewer } from "./OBJViewer.js";

// obj+pc
const objPairs = [
    // ["./static/objs/test.obj", "./static/objs/test_pc.obj"],

    // high-light
    ["./static/objs/1(220)_y.obj", "./static/objs/1(220)_input_pc.obj"],
    ["./static/objs/8_copy6_temp0.9_0_y.obj", "./static/objs/8_input_pc.obj"],
    ["./static/objs/typical_vehicle_locomotive_copy2_temp0.9_0_y.obj", "./static/objs/typical_vehicle_locomotive_copy11_input_pc.obj"],
    ["./static/objs/1(473)_y.obj", "./static/objs/1(473)_input_pc.obj"],
    
    ["./static/objs/1(12)_y.obj", "./static/objs/1(12)_input_pc.obj"],
    ["./static/objs/1(23)_y.obj", "./static/objs/1(23)_input_pc.obj"],
    ["./static/objs/1(37)_y.obj", "./static/objs/1(37)_input_pc.obj"],
    ["./static/objs/1(44)_y.obj", "./static/objs/1(44)_input_pc.obj"],
    ["./static/objs/1(65)_y.obj", "./static/objs/1(65)_input_pc.obj"],
    ["./static/objs/1(82)_y.obj", "./static/objs/1(82)_input_pc.obj"],
    
    // ["./static/objs/1(131)_y.obj", "./static/objs/1(131)_input_pc.obj"],
    ["./static/objs/1(133)_y.obj", "./static/objs/1(133)_input_pc.obj"],
    ["./static/objs/1(152)_y.obj", "./static/objs/1(152)_input_pc.obj"],
    ["./static/objs/1(202)_y.obj", "./static/objs/1(202)_input_pc.obj"],
    ["./static/objs/1(241)_y.obj", "./static/objs/1(241)_input_pc.obj"],
    ["./static/objs/1(247)_y.obj", "./static/objs/1(247)_input_pc.obj"],
    ["./static/objs/1(255)_y.obj", "./static/objs/1(255)_input_pc.obj"],
    ["./static/objs/1(324)_y.obj", "./static/objs/1(324)_input_pc.obj"],
    ["./static/objs/1(326).obj", "./static/objs/1(326)_input_pc.obj"],
    ["./static/objs/1(331).obj", "./static/objs/1(331)_input_pc.obj"],
    ["./static/objs/1(368)_y.obj", "./static/objs/1(368)_input_pc.obj"],
    ["./static/objs/1(389)_y.obj", "./static/objs/1(389)_input_pc.obj"],
    ["./static/objs/1(397)_copy2_y.obj", "./static/objs/1(397)_input_pc.obj"],
    ["./static/objs/1(436).obj", "./static/objs/1(436)_input_pc.obj"],
    ["./static/objs/1(493).obj", "./static/objs/1(493)_input_pc.obj"],
    
    ["./static/objs/21_y.obj", "./static/objs/21_input_pc.obj"],

    ["./static/objs/typical_misc_fireplace_y_149.obj", "./static/objs/typical_misc_fireplace_input_pc.obj"],
    ["./static/objs/typical_creature_dragon_y_161.obj", "./static/objs/typical_creature_dragon_input_pc.obj"],
    ["./static/objs/typical_creature_rock_monster_y.obj", "./static/objs/typical_creature_rock_monster_input_pc.obj"],
    ["./static/objs/typical_humanoid_goblin_y_152.obj", "./static/objs/typical_humanoid_goblin_input_pc.obj"],
    
]

const viewerElementIdPairs = [
    ["obj-viewer-1", "obj-viewer-2"],
    ["obj-viewer-3", "obj-viewer-4"],
    ["obj-viewer-5", "obj-viewer-6"],
    ["obj-viewer-7", "obj-viewer-8"],
]

const highLightResultPrevButtonId = "obj-viewer-container-prev";
const highLightResultNextButtonId = "obj-viewer-container-next";
const highLightResultLabelId = "obj-viewer-container-label";

function addHighLightResult(){
    const highLightResultPrevButton = document.getElementById(highLightResultPrevButtonId);
    const highLightResultNextButton = document.getElementById(highLightResultNextButtonId);
    const highLightResultLabel = document.getElementById(highLightResultLabelId);

    const viewerPairs = viewerElementIdPairs.map((item) => {
        const objViewer = document.getElementById(item[0]);
        const pcViewer = document.getElementById(item[1]);
        return {objViewer, pcViewer};
    });

    const viewerPairAmount = viewerPairs.length;
    const objPairAmount = objPairs.length;
    const viewerPairInfo = new Array(viewerPairAmount).fill(null);
    let currentStartDisplayIdx = 0;

    const update = () => {
        const displayIdx = []
        for(let i = 0; i < viewerPairAmount; i++){
            displayIdx.push((currentStartDisplayIdx + i) % objPairAmount);
            const objPair = objPairs.at((currentStartDisplayIdx + i) % objPairAmount);
            if(viewerPairInfo[i] === null){
                const {objViewer, pcViewer} = viewerPairs[i];
                const objViewerInfo = createObjViewer(
                    objViewer, objPair[0]
                );
                const pcViewerInfo = createObjViewer(
                    pcViewer, objPair[1], { pointcloud: true, pcVtxOrder: [1, 2, 0]}
                );
                viewerPairInfo[i]={
                    obj: objViewerInfo,
                    pc: pcViewerInfo,
                }
            }
            else{
                viewerPairInfo[i].obj.update(objPair[0]);
                viewerPairInfo[i].pc.update(objPair[1]);
            }
        }
        displayIdx.sort();
        highLightResultLabel.textContent = `NO.[${displayIdx}] of ${objPairAmount} pairs.`
    };
    update();

    highLightResultNextButton.onclick = () => {
        currentStartDisplayIdx += viewerPairAmount;
        currentStartDisplayIdx %= objPairAmount;
        update();
    }

    highLightResultPrevButton.onclick = () => {
        currentStartDisplayIdx += objPairAmount - (viewerPairAmount % objPairAmount);
        currentStartDisplayIdx %= objPairAmount;
        update();
    }

    addHighLightResult = () => {
        console.warn("[addHighLightResult] Don't Call this function more than once!")
    };
}

export {addHighLightResult};