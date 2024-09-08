import '../styles/nuclearFamily.css';


type NuclearFamilyProps = {
    id: number
    name: string
    famMem: number
};

export function NuclearFamily({ id, name, famMem }: NuclearFamilyProps) {
    return (
        <>
            <div className="trees">
                <div className="individual-tree"> {id + name + famMem} </div>
            </div>
        </>
    );
}