import 'dotenv/config';
import { app } from './api';

app.listen(process.env.PORT, () => {
  console.log('Server is running');
});
