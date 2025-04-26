import { headModels, HeadShapeType, HeadModel } from "../data/headModels";
import { eyeModels, EyeShapeType, EyeModel } from "../data/eyeModels";

type ModelGalleryProps = {
  selectedPart: "Head" | "Left Eye" | "Right Eye" | "Mouth";
  onSelectModel: (part: "Head" | "Left Eye" | "Right Eye" | "Mouth", modelId: string) => void;
  currentHeadModel: HeadShapeType | null;
  currentLeftEyeModel: EyeShapeType | null;
  currentRightEyeModel: EyeShapeType | null;
};

export default function ModelGallery({
  selectedPart,
  onSelectModel,
  currentHeadModel,
  currentLeftEyeModel,
  currentRightEyeModel
}: ModelGalleryProps) {

  const renderHeadModels = () => {
    return headModels.map((model: HeadModel) => {
      if (!model.SvgComponent) return null;
      const svgProps: React.SVGProps<SVGSVGElement> = {
        width: "32",
        height: "32",
      };
      if (model.id !== 'default') {
        svgProps.fill = currentHeadModel === model.id ? '#FACC15' : '#D1D5DB';
      }
      return (
        <button
          key={model.id}
          onClick={() => onSelectModel("Head", model.id)}
          className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${currentHeadModel === model.id
            ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
            : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
            }`}
          title={model.name}
        >
          <model.SvgComponent {...svgProps} />
        </button>
      );
    });
  };

  const renderEyeModels = (eyeSide: "Left Eye" | "Right Eye") => {
    const currentEye = eyeSide === "Left Eye" ? currentLeftEyeModel : currentRightEyeModel;

    return eyeModels.map((model: EyeModel) => {
      if (!model.SvgComponent) return null;

      const fillColor = currentEye === model.id ? '#60A5FA' : '#D1D5DB';
      const borderClass = currentEye === model.id
        ? "border-blue-400 bg-blue-400/20 text-blue-300"
        : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white";

      return (
        <button
          key={`${eyeSide}-${model.id}`}
          onClick={() => onSelectModel(eyeSide, model.id)}
          className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${borderClass}`}
          title={model.name}
        >
          <model.SvgComponent
            width="32"
            height="32"
            fill={fillColor}
          />
        </button>
      );
    });
  };

  const renderPlaceholders = (part: string) => (
    <p className="text-gray-400 text-sm text-center col-span-5 py-4">
      Models for {part} not yet available.
    </p>
  );

  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {selectedPart === "Head" && renderHeadModels()}
      {selectedPart === "Left Eye" && renderEyeModels("Left Eye")}
      {selectedPart === "Right Eye" && renderEyeModels("Right Eye")}
      {selectedPart === "Mouth" && renderPlaceholders("Mouth")}
    </div>
  );
}