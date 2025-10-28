# n8n-nodes-axiomai

This is an n8n community node that lets you send data to [Axiom.ai](https://axiom.ai) in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes Installation

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install a community node**
3. Enter `n8n-nodes-axiomai` in the **Enter npm package name** field
4. Select **Install**

After installation, the Axiom.ai node will be available in your n8n instance.

### Manual Installation

To install manually, navigate to your n8n installation directory and run:

```bash
npm install n8n-nodes-axiomai
```

## Operations

This node supports the following operation:

- **Post Data**: Send a 2D array of data to Axiom.ai

## Credentials

To use this node, you need to set up your Axiom.ai API credentials:

1. In n8n, go to **Credentials > New**
2. Search for **Axiom.ai API**
3. Enter your **API Key**
4. Click **Save**

You can obtain your API key from your Axiom.ai account settings.

## Compatibility

This node is compatible with n8n version 0.187.0 and above.

## Usage

### Basic Example

1. Add the **Axiom.ai** node to your workflow
2. Connect your credentials
3. Configure the node:
   - **Operation**: Post Data (default)
   - **Axiom Name**: Enter a name for your axiom (e.g., "My Axiom")
   - **Input Mode**: Choose how to provide data (see below)

### Input Modes

The node supports three ways to provide data:

#### 1. Manual JSON (Default)
Enter a 2D array directly in JSON format:

```json
[
  ["A1", "B1", "C1"],
  ["A2", "B2", "C2"],
  ["A3", "B3", "C3"]
]
```

#### 2. From Input Items (Automatic)
Automatically converts input items from previous nodes into a 2D array.

**Example:** If a previous node (like a database query) outputs:
```json
[
  {"name": "John", "email": "john@example.com", "status": "active"},
  {"name": "Jane", "email": "jane@example.com", "status": "active"}
]
```

**Configuration:**
- **Fields to Include**: `name,email,status` (leave empty to include all fields)
- **Include Header Row**: Enable to add field names as the first row

**Result:**
```json
[
  ["name", "email", "status"],
  ["John", "john@example.com", "active"],
  ["Jane", "jane@example.com", "active"]
]
```

#### 3. From Expression
Use n8n expressions to reference data from previous nodes:

```
{{ $json.myData }}
```

### API Request Format

The node sends data to Axiom.ai in the following format:

```json
{
  "key": "your-api-key",
  "name": "My Axiom",
  "data": [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"]
  ]
}
```

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Axiom.ai](https://axiom.ai)
- [n8n documentation](https://docs.n8n.io/)

## License

[MIT](LICENSE.md)

