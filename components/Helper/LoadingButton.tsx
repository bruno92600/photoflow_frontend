import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { Loader } from "lucide-react";

interface Props extends ButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ isLoading, children, ...props }: Props) => {
  return (
    <Button variant={"default"} disabled={isLoading} {...props}>
      {isLoading ? <Loader className="animate-ping mr-2" /> : null}
      {children}
    </Button>
  );
};

export default LoadingButton;
