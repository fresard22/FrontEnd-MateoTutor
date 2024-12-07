import { useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
import type { ExLog } from "../components/LogicTutor/Tools/ExcerciseType2";
import { useAuth } from "../components/Auth";

// Cargar dinámicamente los tutores
const DynamicPlain = dynamic(() => import("../components/lvltutor/Plain"));
const DynamicTutorWP = dynamic(() => import("../components/tutorWordProblems/TutorWordProblem"));
const DynamicTutorLogic = dynamic(() => import("../components/LogicTutor/DynamicTutorLogic"));

const PreviewPage = () => {
  const [previewContent, setPreviewContent] = useState<ExType | ExLog | null>(null);
  const [error, setError] = useState<string>("");

  const { isLoading, project } = useAuth();

  useEffect(() => {
    // Recuperar el JSON de localStorage
    if (isLoading || !project) return;
    const jsonData = localStorage.getItem("ejercicioJSON");
    console.log("jsonData: ", jsonData);
    if (jsonData) {
      try {
        const parsedContent = JSON.parse(jsonData);
        if (!parsedContent.type) {
          throw new Error("El archivo no contiene el campo 'type' necesario para identificar el tipo de ejercicio.");
        }
        setPreviewContent(parsedContent as ExType | ExLog);
        setError("");
      } catch (e) {
        setError(`Error al procesar el archivo: ${(e as Error).message}`);
      } finally {
        // Opcional: limpiar localStorage después de usar
        localStorage.removeItem("ejercicioJSON");
      }
    } else {
      setError("No se encontró ningún archivo JSON en localStorage.");
    }
  }, [isLoading, project]);

  const handleGoBack = () => {
    // Navegar a la página anterior
    window.history.back();
  };

  const handleConfirm = () => {
    // Confirmar la acción
    alert("¡Ejercicio confirmado!");
    // Aquí puedes realizar una acción adicional, como guardar datos o redirigir.
  };

  const renderPreview = () => {
    if (!previewContent) {
      return <Text>No hay contenido para previsualizar.</Text>;
    }

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
    <Box padding="4" maxWidth="600px" margin="auto" position="relative" minHeight="100vh">
      <Text fontSize="2xl" marginBottom="4">Previsualización del ejercicio</Text>
      {error && (
        <Text color="red.500" marginBottom="4">
          {error}
        </Text>
      )}
      <Box marginTop="4">
        {renderPreview()}
      </Box>
      <Box 
        position="fixed" 
        bottom="0" 
        left="0" 
        width="100%" 
        padding="4" 
        bg="white" 
        borderTop="1px solid #e2e8f0" 
        display="flex" 
        justifyContent="space-between"
      >
        <Button colorScheme="gray" onClick={handleGoBack}>Volver</Button>
        <Button colorScheme="teal" onClick={handleConfirm}>Confirmar</Button>
      </Box>
    </Box>
  );
};

export default PreviewPage;
