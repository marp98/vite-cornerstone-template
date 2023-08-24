import { useEffect, useRef } from "react";
import {
  RenderingEngine,
  Enums,
  volumeLoader,
  setVolumesForViewports,
} from "@cornerstonejs/core";
import initDemo from "../helpers/initDemo";
import createImageIdsAndCacheMetaData from "../helpers/createImageIdsAndCacheMetaData";
import {
  addTool,
  ToolGroupManager,
  StackScrollMouseWheelTool,
  WindowLevelTool,
  Enums as csToolsEnums,
} from "@cornerstonejs/tools";

const { MouseBindings } = csToolsEnums;
const { ViewportType } = Enums;

const DicomVolumeViewer = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    const fetchImagesAndRender = async () => {
      await initDemo();

      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const volumeId = "cornerstoneStreamingImageVolume: myVolume";

      const volume = await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      });

      const viewportId1 = "CT_AXIAL";

      const viewportInput = [
        {
          viewportId: viewportId1,
          element: elementRef.current,
          type: ViewportType.ORTHOGRAPHIC,
          defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
          },
        },
      ];

      renderingEngine.setViewports(viewportInput);

      volume.load();

      setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId1]);
      renderingEngine.renderViewports([viewportId1]);

      addTool(StackScrollMouseWheelTool);
      addTool(WindowLevelTool);

      const ctToolGroupId = "CT_TOOLGROUP_ID";
      const ctToolGroup = ToolGroupManager.createToolGroup(ctToolGroupId);

      ctToolGroup.addViewport(viewportId1, renderingEngineId);

      [ctToolGroup].forEach((toolGroup) => {
        toolGroup.addTool(StackScrollMouseWheelTool.toolName);
      });
      ctToolGroup.addTool(WindowLevelTool.toolName);

      [ctToolGroup].forEach((toolGroup) => {
        toolGroup.setToolActive(WindowLevelTool.toolName, {
          bindings: [
            {
              mouseButton: MouseBindings.Primary,
            },
          ],
        });
        toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
      });
    };

    fetchImagesAndRender();
  }, []);

  return (
    <div>
      <p className="text-center mb-12">REACT CORNERSTONE DICOM VIEWER</p>
      <div ref={elementRef} style={{ width: "500px", height: "500px" }} />
    </div>
  );
};

export default DicomVolumeViewer;
