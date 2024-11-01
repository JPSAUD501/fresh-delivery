import { FunctionalComponent } from "preact";

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: FunctionalComponent<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <p class="mb-4">{message}</p>
        <div class="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
