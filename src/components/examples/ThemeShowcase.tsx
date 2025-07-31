import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ThemeShowcase() {
  return (
    <div className="p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">KAOS CRM Theme System</h1>
        
        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Primary Colors */}
            <Card className="p-6">
              <div className="w-full h-20 bg-primary rounded-lg mb-4"></div>
              <h3 className="font-medium">Primary</h3>
              <p className="text-sm text-muted-foreground">Uber Green</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-primary</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-secondary rounded-lg mb-4"></div>
              <h3 className="font-medium">Secondary</h3>
              <p className="text-sm text-muted-foreground">Light gray</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-secondary</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-destructive rounded-lg mb-4"></div>
              <h3 className="font-medium">Destructive</h3>
              <p className="text-sm text-muted-foreground">Error red</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-destructive</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-accent rounded-lg mb-4"></div>
              <h3 className="font-medium">Accent</h3>
              <p className="text-sm text-muted-foreground">Accent color</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-accent</code>
            </Card>
          </div>
        </section>

        {/* Button Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        {/* Chart Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Chart Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-6">
              <div className="w-full h-20 bg-chart-1 rounded-lg mb-4"></div>
              <h3 className="font-medium">Chart 1</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-chart-1</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-chart-2 rounded-lg mb-4"></div>
              <h3 className="font-medium">Chart 2</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-chart-2</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-chart-3 rounded-lg mb-4"></div>
              <h3 className="font-medium">Chart 3</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-chart-3</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-chart-4 rounded-lg mb-4"></div>
              <h3 className="font-medium">Chart 4</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-chart-4</code>
            </Card>
            
            <Card className="p-6">
              <div className="w-full h-20 bg-chart-5 rounded-lg mb-4"></div>
              <h3 className="font-medium">Chart 5</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">bg-chart-5</code>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
          <Card className="p-6 space-y-4">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <p>This is a paragraph with the default text styling using CSS variables.</p>
            <p className="text-muted-foreground">This is muted text using text-muted-foreground.</p>
          </Card>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-medium mb-2">CSS Variables Approach</h3>
              <div className="bg-muted p-4 rounded">
                <code className="text-sm">
                  {`<div className="bg-background text-foreground" />`}
                </code>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-medium mb-2">Custom Gradient Component</h3>
              <div className="custom-gradient text-primary-foreground p-4 rounded">
                This uses a custom gradient utility class
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
