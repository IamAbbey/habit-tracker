import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalStore } from "@/lib/store";

export const AlertConfirmDialog: React.FC = () => {
  const setOpenConfirmBox = useModalStore((state) => state.setOpenConfirmBox);
  const openConfirmBox = useModalStore((state) => state.openConfirmBox);

  return (
    <>
      {openConfirmBox && (
        <AlertDialog
          open={openConfirmBox.open}
          onOpenChange={(open) => {
            setOpenConfirmBox(null);
            if (!open) openConfirmBox.onCancel();
          }}
        >
          <AlertDialogContent className="max-w-96">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {openConfirmBox.title ? openConfirmBox.title : "Are you sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {openConfirmBox.description ? openConfirmBox.description : ""}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  openConfirmBox.onCancel();
                  setOpenConfirmBox(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  openConfirmBox.onConfirm();
                  setOpenConfirmBox(null);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
