
#!/bin/bash

# Start Inngest server in background
./scripts/inngest.sh &

# Start Mastra application
mastra start
