import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { DateTimeCell, PageDetail, PageDetails, useGetPageUrl } from '../../../../framework';
import { LastModifiedPageDetail } from '../../../common/LastModifiedPageDetail';
import { useGet } from '../../../common/crud/useGet';
import { edaAPI } from '../../common/eda-utils';
import { EdaCredential } from '../../interfaces/EdaCredential';
import { EdaDecisionEnvironmentRead } from '../../interfaces/EdaDecisionEnvironment';
import { EdaRoute } from '../../main/EdaRoutes';

export function DecisionEnvironmentDetails() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();

  const imageHelpBlock = (
    <>
      <p>
        {t(
          'The full image location, including the container registry, image name, and version tag.'
        )}
      </p>
      <br />
      <p>{t('Examples:')}</p>
      <Trans>
        <code>quay.io/ansible/awx-latest repo/project/image-name:tag</code>
      </Trans>
    </>
  );
  const { data: decisionEnvironment } = useGet<EdaDecisionEnvironmentRead>(
    edaAPI`/decision-environments/${params.id ?? ''}/`
  );

  const { data: credential } = useGet<EdaCredential>(
    edaAPI`/credentials/${decisionEnvironment?.credential?.id.toString() ?? ''}/`
  );

  const getPageUrl = useGetPageUrl();

  return (
    <PageDetails>
      <PageDetail label={t('Name')}>{decisionEnvironment?.name || ''}</PageDetail>
      <PageDetail label={t('Description')}>{decisionEnvironment?.description || ''}</PageDetail>
      <PageDetail label={t('Image')} helpText={imageHelpBlock}>
        {decisionEnvironment?.image_url || ''}
      </PageDetail>
      <PageDetail
        label={t('Credential')}
        helpText={t('The token needed to utilize the Decision environment image.')}
      >
        {decisionEnvironment && decisionEnvironment.credential?.id ? (
          <Link
            to={getPageUrl(EdaRoute.CredentialPage, {
              params: { id: decisionEnvironment?.credential?.id },
            })}
          >
            {credential?.name}
          </Link>
        ) : (
          credential?.name || ''
        )}
      </PageDetail>
      <PageDetail label={t('Created')}>
        <DateTimeCell format="date-time" value={decisionEnvironment?.created_at} />
      </PageDetail>
      <LastModifiedPageDetail format="date-time" value={decisionEnvironment?.modified_at} />
    </PageDetails>
  );
}
