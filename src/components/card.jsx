import * as React from "react";

function Card({ className = "", ...props }) {
  return (
    <div
      data-slot="card"
      className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border ${className}`}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="card-header"
      className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 ${className}`}
      {...props}
    />
  );
}

function CardTitle({ className = "", children, ...props }) {
  return (
    <h4
      data-slot="card-title"
      className={`leading-none ${className}`}
      {...props}
    >
      {children}
    </h4>
  );
}

function CardDescription({ className = "", ...props }) {
  return (
    <p
      data-slot="card-description"
      className={`text-muted-foreground ${className}`}
      {...props}
    />
  );
}

function CardAction({ className = "", ...props }) {
  return (
    <div
      data-slot="card-action"
      className={`self-start justify-self-end ${className}`}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }) {
  return (
    <div
      data-slot="card-content"
      className={`px-6 pb-6 ${className}`}
      {...props}
    />
  );
}

function CardFooter({ className = "", ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={`flex items-center px-6 pb-6 ${className}`}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
