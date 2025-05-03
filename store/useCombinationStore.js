// useCombinationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCombinationStore = create(
  persist(
    (set, get) => ({
      // Track saved combinations by upload ID
      savedCombinations: [],
      // Track user uploads
      userUploads: [],

      // Add a user upload
      addUserUpload: (upload) => {
        const uploads = get().userUploads;
        const existingUpload = uploads.find((u) => u.id === upload.id);

        if (!existingUpload) {
          set({ userUploads: [...uploads, upload] });
        }

        return upload;
      },

      // Get combinations for a specific upload
      getCombinationsForUpload: (uploadId) => {
        return get().savedCombinations.filter(
          (item) => item.uploadId === uploadId
        );
      },

      // Add a combination for a specific upload
      addCombination: ({ combo, uploadId }) => {
        const combinations = get().savedCombinations;
        const existingCombo = combinations.find(
          (item) => item.combo.id === combo.id && item.uploadId === uploadId
        );

        if (!existingCombo) {
          set({
            savedCombinations: [
              ...combinations,
              {
                combo,
                uploadId,
                timestamp: new Date().toISOString(),
              },
            ],
          });
        }
      },

      // Remove a combination
      removeCombination: (comboId, uploadId) => {
        set({
          savedCombinations: get().savedCombinations.filter(
            (item) => !(item.combo.id === comboId && item.uploadId === uploadId)
          ),
        });
      },

      // Clear all combinations for a specific upload
      clearCombinationsForUpload: (uploadId) => {
        set({
          savedCombinations: get().savedCombinations.filter(
            (item) => item.uploadId !== uploadId
          ),
        });
      },

      // Check if a combination is saved for a specific upload
      isCombinationSaved: (comboId, uploadId) => {
        return get().savedCombinations.some(
          (item) => item.combo.id === comboId && item.uploadId === uploadId
        );
      },
    }),
    {
      name: "outfit-combinations-storage",
    }
  )
);
