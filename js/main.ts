import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express'
import express from 'express'
import cors from 'cors'
const app = express()
const port = 8080



app.use(cors())
app.use(clerkMiddleware())

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Add debug route logging
app.use((req, res, next) => {
  console.log('[Debug] Request URL:', req.url);
  console.log('[Debug] Request Query:', req.query);
  console.log('[Debug] Request Params:', req.params);
  next();
});

// Protect a route based on authorization status
const hasPermission = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth) {
      console.log('[Auth] No auth object')
      return void res.status(400).json({ error: 'Error: No signed-in user' })
    }

    const userId = auth.userId
    if (!userId) {
      console.log('[Auth] No user id')
      return void res.status(400).json({ error: 'Error: No signed-in user' })
    }

    const user = await clerkClient.users.getUser(userId)
    req.user = user

    console.log(`[Auth] User: ${user.username}`)

    if (!user) {
      console.log('[Auth] No user')
      return void res.status(400).json({ error: 'Error: No signed-in user' })
    }

    return next();
  } catch (error) {
    console.error('[Error] Permission check failed:', error);
    next(error);
  }
};

app.get('/protected', requireAuth(), hasPermission, (req, res) => {
  console.log('[Route] Protected endpoint accessed');
  res.json(req.auth);
});

app.get('/', hasPermission, (req, res) => {
  console.log('[Route] Root endpoint accessed');
  res.send({
    msg: `Hello ${req.user.username}`
  });
});

// Add 404 handler
app.use((req, res) => {
  console.log('[Error] 404 - Not Found:', req.url);
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Update error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})