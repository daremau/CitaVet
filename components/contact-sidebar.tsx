import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import Link from "next/link"

export function ContactSidebar() {
  return (
    <div className="w-80 bg-white p-8 flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">SÍGUENOS</h3>
        <div className="flex gap-4">
          <Link href="#" className="hover:opacity-80">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:opacity-80">
            <Instagram className="h-6 w-6" />
          </Link>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">CONTACTOS</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <span>(0991) 798 999</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>wonderpets@gmail.com</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">LOCATION</h3>
        <div className="space-y-1">
          <p>24 de Junio c/ José Rivera</p>
          <p>San Lorenzo</p>
          <p>Villa del Maestro</p>
        </div>
      </div>
    </div>
  )
}

