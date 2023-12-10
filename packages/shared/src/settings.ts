const settings = {
  identity: {
    sessionExpirySeconds: parseInt(process.env.IDENTITY_SESSION_EXPIRES_SECONDS || '3600'),
  },
}

export default settings
