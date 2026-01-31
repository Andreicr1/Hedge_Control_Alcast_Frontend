import { BusyIndicator, Text } from '@ui5/webcomponents-react';

export interface FioriBusyTextProps {
  message: string;
}

export function FioriBusyText({ message }: FioriBusyTextProps) {
  return (
    <>
      <BusyIndicator active delay={0} />
      <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>{message}</Text>
    </>
  );
}
