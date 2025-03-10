import { Box, Button, Flex, Typography } from "@bloxi/components";
import { component, state, onMount } from "@bloxi/core";

/**
 * DeleteConfirmation - A component demonstrating the improved reactivity system
 */
export const DeleteConfirmation = component({
  name: "DeleteConfirmation",

  setup() {
    // Create a reactive state for toggling the confirmation
    const showConfirmation = state(false);
    const itemName = state("This item");
    console.log("State updated, DOM should update in next microtask");

    // Toggle confirmation dialog
    const handleDeleteClick = () => {
      console.log("Delete clicked, current state:", showConfirmation.value);
      showConfirmation.value = true;
      console.log("State after update:", showConfirmation.value);
    };

    // Confirm deletion
    const confirmDelete = () => {
      console.log(`${itemName.value} deleted!`);
      showConfirmation.value = false;
    };

    // Cancel deletion
    const cancelDelete = () => {
      console.log("Deletion canceled");
      showConfirmation.value = false;
    };

    return {
      showConfirmation,
      itemName,
      handleDeleteClick,
      confirmDelete,
      cancelDelete,
    };
  },

  render({
    showConfirmation,
    itemName,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  }) {
    console.log(
      "Rendering DeleteConfirmation, showConfirmation:",
      showConfirmation.value
    );

    return Box({
      style: {
        padding: "1.5rem",
        border: "1px solid #e2e8f0",
        borderRadius: "0.5rem",
        maxWidth: "500px",
        margin: "0 auto",
      },
      children: [
        // Always visible delete button
        Box({
          style: { marginBottom: showConfirmation.value ? "1.5rem" : "0" },
          children: Button({
            variant: "danger",
            onClick: handleDeleteClick,
            children: `Delete ${itemName.value}`,
          }),
        }),

        // Conditional rendering based on state
        ...(showConfirmation.value
          ? [
              Box({
                style: {
                  padding: "1rem",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "0.375rem",
                },
                children: [
                  Typography({
                    style: {
                      marginBottom: "1rem",
                      fontWeight: 500,
                      color: "#991B1B",
                    },
                    children: `Are you sure you want to delete ${itemName.value}? This action cannot be undone.`,
                  }),

                  Flex({
                    justify: "flex-end",
                    gap: "0.5rem",
                    children: [
                      Button({
                        variant: "default",
                        onClick: cancelDelete,
                        children: "Cancel",
                      }),
                      Button({
                        variant: "danger",
                        onClick: confirmDelete,
                        children: "Yes, Delete",
                      }),
                    ],
                  }),
                ],
              }),
            ]
          : []),
      ],
    });
  },
});
