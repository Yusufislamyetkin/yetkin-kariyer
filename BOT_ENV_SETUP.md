# Bot System Environment Variables

## Required Environment Variables for Bot System

### Next.js (.env.local)

Add the following environment variables to your `.env.local` file:

```env
# Bot API Key for Hangfire requests (must match .NET Core BotApiKey)
BOT_API_KEY=your-secure-api-key-here

# .NET Core API URL for webhook calls
DOTNET_API_URL=http://localhost:5000

# .NET Core API Key for webhook authentication (optional, if .NET Core requires it)
DOTNET_API_KEY=your-dotnet-api-key-here
```

- `BOT_API_KEY`: Used to authenticate requests from .NET Core Hangfire to the Next.js bot execute endpoint
- `DOTNET_API_URL`: The base URL of your .NET Core application
- `DOTNET_API_KEY`: Optional API key for authenticating webhook calls to .NET Core (if .NET Core webhook endpoint requires authentication)

### .NET Core (appsettings.json or Environment Variables)

Add the following configuration to your `appsettings.json` or set as environment variables:

```json
{
  "FrontendApiUrl": "https://ytkcareer.com.tr",
  "BotApiKey": "your-secure-api-key-here",
  "WebhookApiKey": "your-dotnet-api-key-here",
  "Supabase": {
    "Url": "https://your-project.supabase.co",
    "ServiceRoleKey": "your-service-role-key-here"
  }
}
```

Or set as environment variables:

```bash
# Windows
set FrontendApiUrl=https://ytkcareer.com.tr
set BotApiKey=your-secure-api-key-here
set Supabase__Url=https://your-project.supabase.co
set Supabase__ServiceRoleKey=your-service-role-key-here

# Linux/Mac
export FrontendApiUrl=https://ytkcareer.com.tr
export BotApiKey=your-secure-api-key-here
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Notes

- `BOT_API_KEY`: Must be the same value in both Next.js and .NET Core configurations (used for Next.js execute endpoint)
- `DOTNET_API_URL`: The base URL of your .NET Core application (used by Next.js to send webhooks)
- `DOTNET_API_KEY` / `WebhookApiKey`: Optional API key for authenticating webhook calls from Next.js to .NET Core
- `FrontendApiUrl`: The base URL of your Next.js application (used by .NET Core to call execute endpoint)
- `Supabase:Url`: Your Supabase project URL (used for fallback sync, optional)
- `Supabase:ServiceRoleKey`: Your Supabase service role key (found in Supabase dashboard > Settings > API, optional)

## Security

- Never commit `.env.local` or `appsettings.json` with real credentials to version control
- Use strong, randomly generated API keys
- Rotate API keys periodically
- Use different keys for development and production environments
