import { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
import type { ExLog } from "../components/LogicTutor/Tools/ExcerciseType2";

// Cargar dinámicamente los tutores
const DynamicPlain = dynamic(() => import("../components/lvltutor/Plain"));
const DynamicTutorWP = dynamic(() => import("../components/tutorWordProblems/TutorWordProblem"));
const DynamicTutorLogic = dynamic(() => import("../components/LogicTutor/DynamicTutorLogic"));

const PreviewPage = () => {
  const [previewContent, setPreviewContent] = useState<ExType | ExLog | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const parsedContent = JSON.parse(fileContent);

      // Validaciones específicas para el archivo
      if (!parsedContent.type) {
        throw new Error("El archivo no contiene el campo 'type' necesario para identificar el tipo de ejercicio.");
      }

      // Validaciones solo para tipos específicos, eliminando restricción de `exc` para `lvltutor2`
      if (parsedContent.type === "lvltutor" && !parsedContent.steps) {
        throw new Error("El archivo de tipo 'lvltutor' debe contener el campo 'steps'.");
      } else if (parsedContent.type === "wordProblem" && !parsedContent.exercise) {
        throw new Error("El archivo de tipo 'wordProblem' debe contener el campo 'exercise'.");
      }

      setPreviewContent(parsedContent as ExType | ExLog);
      setError("");
    } catch (e) {
      setError(`Error al procesar el archivo: ${(e as Error).message}`);
      setPreviewContent(null);
    }
  };

  const renderPreview = () => {
    if (!previewContent) {
      return <Text>No hay contenido para previsualizar.</Text>;
    }

    // Renderizar el componente adecuado basado en el tipo del contenido
    switch (previewContent.type) {
      case "lvltutor":
        return <DynamicPlain steps={previewContent as ExType} />;
      case "wordProblem":
        return <DynamicTutorWP exercise={previewContent as ExType} />;
      case "lvltutor2":
        return <DynamicTutorLogic exc={previewContent as ExLog} />;
      default:
        return <Text>Tipo de ejercicio no soportado para previsualización.</Text>;
    }
  };

  return (
    <Box padding="4" maxWidth="600px" margin="auto">
      <Text fontSize="2xl" marginBottom="4">Sube un archivo .json para previsualizar el ejercicio</Text>
      
      <Input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        marginBottom="4"
      />
      
      {error && (
        <Text color="red.500" marginBottom="4">
          {error}
        </Text>
      )}

      <Box marginTop="4">
        {renderPreview()}
      </Box>
    </Box>
  );
};

export default PreviewPage;
