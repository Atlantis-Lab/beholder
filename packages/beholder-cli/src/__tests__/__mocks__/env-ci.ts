export default jest.fn(() => ({
  isCi: true,
  service: 'service',
  commit: 'commit',
  slug: 'owner/repo',
}))
