# Aurelle Website Backend

This project contains the backend for the Aurelle website.

## Backend setup

1. Open a terminal in the `Backend` folder.
2. Install dependencies:

```powershell
cd Backend
npm install
```

3. Create or update `Backend/.env` with your MongoDB Atlas connection string:

```env
API_URL=/api/v1
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.5trpfzu.mongodb.net/aurelle-database?retryWrites=true&w=majority
```

4. Start the backend:

```powershell
cd Backend
npm start
```

## Notes

- The server uses `MONGODB_URI` first, then `CONNECTION_STRING`, and falls back to a local MongoDB URI if neither is set.
- Replace `<username>` and `<password>` with your Atlas credentials.
- If you use Atlas, make sure your IP is allowed in the Atlas network access settings.
