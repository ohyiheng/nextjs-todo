import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


export default function PrioritySelect({
    onValueChange,
    defaultValue
}: {
    onValueChange: (value: string) => void,
    defaultValue?: string
}) {
    return (
        <Select onValueChange={onValueChange} defaultValue={defaultValue}>
            <SelectTrigger>
                <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0">No priority</SelectItem>
                <SelectItem value="1">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">High</SelectItem>
            </SelectContent>
        </Select>
    )
}