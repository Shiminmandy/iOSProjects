type Props = {
    type: "login" | "signUp";
  };

export const AuthForm = ({ type }: Props) => {
    return (
        <div>
            <h1>{type}</h1>
        </div>
    )
}