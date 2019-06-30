const fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'mock' }),
  })
)

export default fetch
