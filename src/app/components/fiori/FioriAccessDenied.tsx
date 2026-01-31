import { MessageStrip, Text, Title } from '@ui5/webcomponents-react';
import { UX_COPY } from '../../ux/copy';

export interface FioriAccessDeniedProps {
  requiredProfilesLabel: string;
}

export function FioriAccessDenied({ requiredProfilesLabel }: FioriAccessDeniedProps) {
  return (
    <div className="sap-fiori-page p-4">
      <div className="sap-fiori-section">
        <div className="sap-fiori-section-content">
          <Title level="H2">{UX_COPY.errors.title}</Title>
          <div className="mt-3">
            <MessageStrip design="Negative" hideCloseButton>
              <Text>Acesso negado. Esta rota requer perfil {requiredProfilesLabel}.</Text>
            </MessageStrip>
          </div>
        </div>
      </div>
    </div>
  );
}
