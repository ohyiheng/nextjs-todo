import { useUser } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteUser } from "@/lib/auth";
import * as React from "react";

export default function SettingsUser() {
    const user = useUser();
    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = React.useState(false);
    const [ usernameInput, setUsernameInput ] = React.useState("");

    return (
        <div>
            <h3 className="mb-1">Delete account</h3>
            <p className="text-muted-foreground text-xs mb-4">Deleting your account is permanent. All of your data will be lost.</p>
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete account</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm deletion of account</DialogTitle>
                    </DialogHeader>
                    <Label htmlFor="username" className="leading-4">Please type your username "{user}"</Label>
                    <Input name="username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button disabled={usernameInput !== user} variant="destructive" type="submit"
                            onClick={async () => {
                                if (usernameInput === user) await deleteUser(user);
                            }}>
                            Confirm
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}