import {utilities as csUtils} from "@cornerstonejs/core";

const scalingPerImageId = {};

function addInstance(imageId, scalingMetaData) {
    const imageURI = csUtils.imageIdToURI(imageId);
    scalingPerImageId[imageURI] = scalingMetaData;
}

function get(type, imageId) {
    if (type === 'scalingModule') {
        const imageURI = csUtils.imageIdToURI(imageId);
        return scalingPerImageId[imageURI];
    }
}

const instanceObject = {addInstance, get};

export default instanceObject;