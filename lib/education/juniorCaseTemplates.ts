// Tüm programlama dilleri için initial code template'leri

export function getJuniorCaseTemplate(languageId: string): string {
  const templates: Record<string, string> = {
    csharp: `using System;

namespace LiveCoding
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            // Çözümünüzü buraya yazın
        }
    }
}`,

    java: `public class Solution {
    public static void main(String[] args) {
        // Çözümünüzü buraya yazın
    }
}`,

    python: `# Çözümünüzü buraya yazın
def main():
    pass

if __name__ == "__main__":
    main()
`,

    javascript: `// Çözümünüzü buraya yazın
function main() {
    // Kodunuz buraya
}

main();
`,

    typescript: `// Çözümünüzü buraya yazın
function main(): void {
    // Kodunuz buraya
}

main();
`,

    go: `package main

import "fmt"

func main() {
    // Çözümünüzü buraya yazın
}
`,

    rust: `fn main() {
    // Çözümünüzü buraya yazın
}
`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    // Çözümünüzü buraya yazın
    return 0;
}
`,

    kotlin: `fun main() {
    // Çözümünüzü buraya yazın
}
`,

    swift: `import Foundation

func main() {
    // Çözümünüzü buraya yazın
}

main()
`,

    php: `<?php

// Çözümünüzü buraya yazın

?>`,
    ruby: `# Çözümünüzü buraya yazın
def main
    # Kodunuz buraya
end

main
`,

    scala: `object Solution {
    def main(args: Array[String]): Unit = {
        // Çözümünüzü buraya yazın
    }
}`,

    dart: `void main() {
    // Çözümünüzü buraya yazın
}
`,

    r: `# Çözümünüzü buraya yazın
main <- function() {
    # Kodunuz buraya
}

main()
`
  };

  return templates[languageId] || templates.csharp;
}

