import React from 'react';
import { act, renderWithRedux, patientlyWaitFor, fireEvent } from 'react-testing-lib-wrapper';
import { Route } from 'react-router-dom';
import { head, last } from 'lodash';
import { nockInstance, assertNockRequest, mockAutocomplete, mockSetting } from '../../../../../../test-utils/nockWrapper';
import api from '../../../../../../services/api';

import ContentViewVersions from '../../ContentViewVersions';
import cvVersionsData from './contentViewVersions.fixtures.json';
import cvDetailsData from './contentViewDetails.fixtures.json';
import environmentPathsData from '../../../../Publish/__tests__/environmentPaths.fixtures.json';
import CVVersionCompare from '../CVVersionCompare';
import cvVersionRPMPackagesCompareData from './CVVersionRPMPackagesCompareData.fixtures.json';
import cvVersionErrataCompareData from './CVVersionErrataCompareData.fixtures.json';
import cvVersionPackageGroupsCompareData from './CVVersionPackageGroupsCompareData.fixtures.json';
import cvVersionFilesCompareData from './CVVersionFilesCompareData.fixtures.json';
import cvVersionModuleStreamsCompareData from './CVVersionModuleStreamsCompareData.fixtures.json';
import cvVersionDebPackagesCompareData from './CVVersionDebPackagesCompareData.fixtures.json';
import cvVersionContainerTagsCompareData from './CVVersionContainerTagsCompareData.fixtures.json';
import versionOneDetailsData from './contentViewVersionOneDetials.fixtures.json';
import versionTwoDetailsData from './contentViewVersionTwoDetails.fixtures.json';
import versionThreeDetailsData from './contentViewVersionThreeDetails.fixtures.json';
import emptyStateVersionOneData from './emptyStateCVVersionOneDetails.fixtures.json';
import empptyStateVersionTwoData from './emptyStateCVVersionTwoDetails.fixtures.json';

const cvVersions = api.getApiUrl('/content_view_versions');
const cvDetails = api.getApiUrl('/content_views/4');
const versionDetails = versionId => api.getApiUrl(`/content_view_versions/${versionId}`);
const autocompleteUrl = '/content_view_versions/auto_complete_search';
const withCVRoute = component => <Route path="/content_views/:id">{component}</Route>;
const environmentPathsPath = api.getApiUrl('/organizations/1/environments/paths');
const renderOptions = {
  initialState: {
    API: {
      CONTENT_VIEW_VERSION_DETAILS_51_21: {
        status: 'RESOLVED',
      },
      CONTENT_VIEW_VERSION_DETAILS_55_21: {
        status: 'RESOLVED',
      },
    },
  },
  routerParams: {
    initialEntries: [{ pathname: '/content_views/4' }],
    initialIndex: 1,
  },

};

let searchDelayScope;
let autoSearchScope;
let envScope;

const versionIdsAllContentTypes = {
  versionOneId: '15',
  versionTwoId: '17',
};

const versionIdsThreeContentTypes = {
  versionOneId: '14',
  versionTwoId: '15',
};

const versionLabelsAllContentTypes = {
  versionOneLabel: '4',
  versionTwoLabel: '6',
};

const versionLabelsThreeContentTypes = {
  versionOneLabel: '3',
  versionTwoLabel: '4',
};
beforeEach(() => {
  envScope = nockInstance
    .get(environmentPathsPath)
    .query(true)
    .reply(200, environmentPathsData);
});

afterEach(() => {
  assertNockRequest(envScope);
});

const testConfigAllContentTypes = [
  {
    name: 'RPM packages',
    countKey: 'rpm_count',
    autoCompleteUrl: '/packages/auto_complete_search',
    dataUrl: api.getApiUrl('/packages/compare'),
    data: cvVersionRPMPackagesCompareData,
    textQuery: [
      head(cvVersionRPMPackagesCompareData.results).nvrea,
      last(cvVersionRPMPackagesCompareData.results).nvrea],
  },
  {
    name: 'RPM package groups',
    countKey: 'package_group_count',
    autoCompleteUrl: '/package_groups/auto_complete_search',
    dataUrl: api.getApiUrl('/package_groups/compare'),
    data: cvVersionPackageGroupsCompareData,
    textQuery: [
      head(cvVersionPackageGroupsCompareData.results).name,
      last(cvVersionPackageGroupsCompareData.results).name],
  },
  {
    name: 'Files',
    countKey: 'file_count',
    autoCompleteUrl: '/files/auto_complete_search',
    dataUrl: api.getApiUrl('/files/compare'),
    data: cvVersionFilesCompareData,
    textQuery: [
      head(cvVersionFilesCompareData.results).name,
      last(cvVersionFilesCompareData.results).name],
  },
  {
    name: 'Errata',
    countKey: 'erratum_count',
    autoCompleteUrl: '/errata/auto_complete_search',
    dataUrl: api.getApiUrl('/errata/compare'),
    data: cvVersionErrataCompareData,
    textQuery: [
      head(cvVersionErrataCompareData.results).name,
      last(cvVersionErrataCompareData.results).name],
  },
  {
    name: 'Module streams',
    countKey: 'module_stream_count',
    autoCompleteUrl: '/module_streams/auto_complete_search',
    dataUrl: api.getApiUrl('/module_streams/compare'),
    data: cvVersionModuleStreamsCompareData,
    textQuery: [
      head(cvVersionModuleStreamsCompareData.results).name,
      last(cvVersionModuleStreamsCompareData.results).name],
  },
  {
    name: 'Deb packages',
    countKey: 'deb_count',
    autoCompleteUrl: '/debs/auto_complete_search',
    dataUrl: api.getApiUrl('/debs/compare'),
    data: cvVersionDebPackagesCompareData,
    textQuery: [
      head(cvVersionDebPackagesCompareData.results).name,
      last(cvVersionDebPackagesCompareData.results).name],
  },
  {
    name: 'Container tags',
    countKey: 'docker_tag_count',
    autoCompleteUrl: '/docker_tags/auto_complete_search',
    dataUrl: api.getApiUrl('/docker_tags/compare'),
    data: cvVersionContainerTagsCompareData,
    textQuery: [
      head(cvVersionContainerTagsCompareData.results).name,
      last(cvVersionContainerTagsCompareData.results).name],
  },
  {
    name: 'Python packages',
    countKey: 'python_package_count',
    autoCompleteUrl: '/python_packages/auto_complete_search',
    dataUrl: api.getApiUrl('/python_packages/compare'),
    data: cvVersionContainerTagsCompareData,
    textQuery: [
      head(cvVersionContainerTagsCompareData.results).name,
      last(cvVersionContainerTagsCompareData.results).name],
  },
  {
    name: 'Ansible collections',
    countKey: 'ansible_collection_count',
    autoCompleteUrl: '/ansible_collections/auto_complete_search',
    dataUrl: api.getApiUrl('/ansible_collections/compare'),
    data: cvVersionContainerTagsCompareData,
    textQuery: [
      head(cvVersionContainerTagsCompareData.results).name,
      last(cvVersionContainerTagsCompareData.results).name],
  },
];


const testConfigThreeContentTypes = [
  {
    name: 'RPM packages',
    countKey: 'rpm_count',
    autoCompleteUrl: '/packages/auto_complete_search',
    dataUrl: api.getApiUrl('/packages/compare'),
    data: cvVersionRPMPackagesCompareData,
    textQuery: [
      head(cvVersionRPMPackagesCompareData.results).nvrea,
      last(cvVersionRPMPackagesCompareData.results).nvrea],
  },
  {
    name: 'Errata',
    countKey: 'erratum_count',
    autoCompleteUrl: '/errata/auto_complete_search',
    dataUrl: api.getApiUrl('/errata/compare'),
    data: cvVersionErrataCompareData,
    textQuery: [
      head(cvVersionErrataCompareData.results).name,
      last(cvVersionErrataCompareData.results).name],
  },
  {
    name: 'Files',
    countKey: 'file_count',
    autoCompleteUrl: '/files/auto_complete_search',
    dataUrl: api.getApiUrl('/files/compare'),
    data: cvVersionFilesCompareData,
    textQuery: [
      head(cvVersionFilesCompareData.results).name,
      last(cvVersionFilesCompareData.results).name],
  },
];


test('Can make an API call and show comparison of two versions with all content types', async (done) => {
  const autoCompleteContentTypesScope = testConfigAllContentTypes.map(({ autoCompleteUrl }) =>
    mockAutocomplete(nockInstance, autoCompleteUrl));

  const scopeContentTypes = testConfigAllContentTypes.map(({ dataUrl, data }) =>
    nockInstance.get(dataUrl).query(true).reply(200, data));

  const scopeCVDetails = nockInstance
    .get(cvDetails)
    .query(true)
    .reply(200, cvDetailsData);

  const scopeVersionOneDetails = nockInstance
    .get(versionDetails(15))
    .query(true)
    .reply(200, versionOneDetailsData);
  const scopeVersionTwoDetails = nockInstance
    .get(versionDetails(17))
    .query(true)
    .reply(200, versionTwoDetailsData);
  const { queryByText, queryAllByText, getAllByText } = renderWithRedux(
    withCVRoute(<CVVersionCompare
      cvId={4}
      versionIds={versionIdsAllContentTypes}
      versionLabels={versionLabelsAllContentTypes}
    />),
    renderOptions,
  );

  searchDelayScope = mockSetting(nockInstance, 'autosearch_delay', undefined, 9);
  autoSearchScope = mockSetting(nockInstance, 'autosearch_while_typing', undefined, 9);

  // Nothing will show at first, page is loading
  expect(queryByText(`Version ${versionLabelsAllContentTypes.versionOneLabel}`)).toBeNull();
  expect(queryByText(`Version ${versionLabelsAllContentTypes.versionTwoLabel}`)).toBeNull();

  // Assert that the CV version is now showing on the screen, but wait for it to appear.

  await patientlyWaitFor(() => {
    expect(getAllByText(`Version ${versionLabelsAllContentTypes.versionOneLabel}`)).toBeTruthy();
  });

  await patientlyWaitFor(() => {
    expect(getAllByText(`Version ${versionLabelsAllContentTypes.versionTwoLabel}`)).toBeTruthy();
  });
  // Ensure that tab exists on the screen
  await patientlyWaitFor(() => {
    testConfigAllContentTypes.forEach(({ name, textQuery }) => {
      expect(queryByText(name)).toBeTruthy();
      textQuery.forEach(query => expect(queryAllByText(query)).toBeTruthy());
    });
  });


  assertNockRequest(scopeCVDetails);
  assertNockRequest(scopeVersionOneDetails);
  assertNockRequest(scopeVersionTwoDetails);
  scopeContentTypes.map(cv => assertNockRequest(cv));
  autoCompleteContentTypesScope.map(cv => assertNockRequest(cv));
  assertNockRequest(searchDelayScope);
  assertNockRequest(autoSearchScope);
  act(done);
});

test('Can make an API call and compare two versions with three content types', async (done) => {
  const autoCompleteContentTypesScope = testConfigThreeContentTypes.map(({ autoCompleteUrl }) =>
    mockAutocomplete(nockInstance, autoCompleteUrl));
  const scopeContentTypes = testConfigThreeContentTypes.map(({ dataUrl, data }) =>
    nockInstance.get(dataUrl).query(true).reply(200, data));
  const scopeCVDetails = nockInstance
    .get(cvDetails)
    .query(true)
    .reply(200, cvDetailsData);
  const scopeVersionOneDetails = nockInstance
    .get(versionDetails(14))
    .query(true)
    .reply(200, versionThreeDetailsData);
  const scopeVersionTwoDetails = nockInstance
    .get(versionDetails(15))
    .query(true)
    .reply(200, versionOneDetailsData);
  const { queryByText, queryAllByText, getAllByText } = renderWithRedux(
    withCVRoute(<CVVersionCompare
      cvId={4}
      versionIds={versionIdsThreeContentTypes}
      versionLabels={versionLabelsThreeContentTypes}
    />),
    renderOptions,
  );

  searchDelayScope = mockSetting(nockInstance, 'autosearch_delay', undefined, 3);
  autoSearchScope = mockSetting(nockInstance, 'autosearch_while_typing', undefined, 3);

  // Nothing will show at first, page is loading
  expect(queryByText(`Version ${versionLabelsThreeContentTypes.versionOneLabel}`)).toBeNull();
  expect(queryByText(`Version ${versionLabelsThreeContentTypes.versionTwoLabel}`)).toBeNull();

  // Assert that the CV version is now showing on the screen, but wait for it to appear.

  await patientlyWaitFor(() => {
    expect(getAllByText(`Version ${versionLabelsThreeContentTypes.versionOneLabel}`)).toBeTruthy();
  });

  await patientlyWaitFor(() => {
    expect(getAllByText(`Version ${versionLabelsThreeContentTypes.versionTwoLabel}`)).toBeTruthy();
  });
  // Ensure that tab exists on the screen
  await patientlyWaitFor(() => {
    testConfigThreeContentTypes.forEach(({ name, textQuery }) => {
      expect(queryByText(name)).toBeTruthy();
      textQuery.forEach(query => expect(queryAllByText(query)).toBeTruthy());
    });
  });


  assertNockRequest(scopeCVDetails);
  assertNockRequest(scopeVersionOneDetails);
  assertNockRequest(scopeVersionTwoDetails);
  scopeContentTypes.map(cv => assertNockRequest(cv));
  autoCompleteContentTypesScope.map(cv => assertNockRequest(cv));
  assertNockRequest(searchDelayScope);
  assertNockRequest(autoSearchScope);
  act(done);
});

test('Can select two versions and click compare button', async (done) => {
  const autoCompleteContentTypesScope = testConfigAllContentTypes.map(({ autoCompleteUrl }) =>
    mockAutocomplete(nockInstance, autoCompleteUrl));
  const autocompleteScope = mockAutocomplete(nockInstance, autocompleteUrl);
  const scopeContentTypes = testConfigAllContentTypes.map(({ dataUrl, data }) =>
    nockInstance.get(dataUrl).query(true).reply(200, data));
  searchDelayScope = mockSetting(nockInstance, 'autosearch_delay', undefined, 10);
  autoSearchScope = mockSetting(nockInstance, 'autosearch_while_typing', undefined, 10);
  const scope = nockInstance
    .get(cvVersions)
    .query(true)
    .reply(200, cvVersionsData);
  const scopeCVDetails = nockInstance
    .get(cvDetails)
    .query(true)
    .reply(200, cvDetailsData);
  const scopeVersionOneDetails = nockInstance
    .get(versionDetails(15))
    .query(true)
    .reply(200, versionOneDetailsData);
  const scopeVersionTwoDetails = nockInstance
    .get(versionDetails(17))
    .query(true)
    .reply(200, versionTwoDetailsData);
  const { getByLabelText, getByText } = renderWithRedux(
    withCVRoute(<ContentViewVersions cvId={4} details={cvDetailsData} />),
    renderOptions,
  );

  await patientlyWaitFor(() => {
    expect(getByLabelText('Select version 15')).toBeInTheDocument();
    expect(getByLabelText('Select version 17')).toBeInTheDocument();
    expect(getByLabelText('compare_two_versions')).toHaveAttribute('disabled');
  });
  fireEvent.click(getByLabelText('Select version 15'));
  fireEvent.click(getByLabelText('Select version 17'));

  await patientlyWaitFor(() => {
    expect(getByLabelText('compare_two_versions')).toBeInTheDocument();
  });
  fireEvent.click(getByLabelText('compare_two_versions'));
  await patientlyWaitFor(() => {
    expect(getByText('Compare')).toBeInTheDocument();
  });

  scopeContentTypes.map(cv => assertNockRequest(cv));
  autoCompleteContentTypesScope.map(cv => assertNockRequest(cv));
  assertNockRequest(scopeVersionOneDetails);
  assertNockRequest(scopeVersionTwoDetails);
  assertNockRequest(autocompleteScope);
  assertNockRequest(scope);
  assertNockRequest(scopeCVDetails);
  assertNockRequest(searchDelayScope);
  assertNockRequest(autoSearchScope);
  act(done);
});


test('Can select two versions with no content and click compare button', async (done) => {
  const autocompleteScope = mockAutocomplete(nockInstance, autocompleteUrl);
  searchDelayScope = mockSetting(nockInstance, 'autosearch_delay');
  autoSearchScope = mockSetting(nockInstance, 'autosearch_while_typing');
  const scope = nockInstance
    .get(cvVersions)
    .query(true)
    .reply(200, cvVersionsData);
  const scopeCVDetails = nockInstance
    .get(cvDetails)
    .query(true)
    .reply(200, cvDetailsData);
  const scopeVersionOneDetails = nockInstance
    .get(versionDetails(12))
    .query(true)
    .reply(200, emptyStateVersionOneData);
  const scopeVersionTwoDetails = nockInstance
    .get(versionDetails(13))
    .query(true)
    .reply(200, empptyStateVersionTwoData);
  const { getByLabelText, getByText } = renderWithRedux(
    withCVRoute(<ContentViewVersions cvId={4} details={cvDetailsData} />),
    renderOptions,
  );

  await patientlyWaitFor(() => {
    expect(getByLabelText('Select version 12')).toBeInTheDocument();
    expect(getByLabelText('Select version 13')).toBeInTheDocument();
    expect(getByLabelText('compare_two_versions')).toHaveAttribute('disabled');
  });
  fireEvent.click(getByLabelText('Select version 12'));
  fireEvent.click(getByLabelText('Select version 13'));

  await patientlyWaitFor(() => {
    expect(getByLabelText('compare_two_versions')).toBeInTheDocument();
  });
  fireEvent.click(getByLabelText('compare_two_versions'));
  await patientlyWaitFor(() => {
    expect(getByText('Versions to compare')).toBeInTheDocument();
  });

  assertNockRequest(scopeVersionOneDetails);
  assertNockRequest(scopeVersionTwoDetails);
  assertNockRequest(autocompleteScope);
  assertNockRequest(scope);
  assertNockRequest(scopeCVDetails);
  assertNockRequest(searchDelayScope);
  assertNockRequest(autoSearchScope);
  act(done);
});
