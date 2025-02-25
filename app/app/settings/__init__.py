from .base import *


if os.getenv('ENV', 'dev') == 'prod':
   from .release import *
else:
   from .dev import *
