import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, ValidatorFn, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { PostulantesService } from '../services/postulantes.service';
import { UppercaseDirective } from '../shared/directives/uppercase.directive';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; //para capturar los parametros de la url
import { FormDataService } from '../services/form-data.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'formulario',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    UppercaseDirective,
    RouterModule,
    MatOption,
    MatSelect,
    NgxMaskDirective,
    MatProgressSpinnerModule,
    MatCheckbox,
    MatIcon,
    MatNativeDateModule,
    MatDatepickerModule,

  ],
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  providers: [provideNgxMask()],
})


export class FormularioComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) {}

private _formBuilder = inject(FormBuilder);
private postulanteService = inject(PostulantesService);
private router =  inject(Router);
private route = inject(ActivatedRoute);
private formDataService = inject(FormDataService)
private edadMaxima = 24;
verificando = false;
tipoInscripcionId: number = 0;
enviando:boolean = false;
formData: any;
maxFechaNacimiento: Date = new Date();

ngOnInit(): void {
  let PropertyRoute = this.route.snapshot.paramMap.get('id') ?? "cadete";
  this.tipoInscripcionId = this.tipoInscripcion(PropertyRoute);

  this.formDataService.getFormData().subscribe(data => {
    this.formData = data;
    console.log(this.formData);
  });

  const hoy = new Date();
  this.maxFechaNacimiento = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());


  this.InicialFormGroup.get('nacionalidadId')?.valueChanges.subscribe(nacionalidadId => {

    const numerNacionalidad = parseInt(nacionalidadId ?? "1");

    const checkboxCtrl = this.InicialFormGroup.get('nacionalizado');
    if (!checkboxCtrl) return;

    if (numerNacionalidad !== 1) {
      checkboxCtrl.setValidators([Validators.requiredTrue]);
    } else {
      checkboxCtrl.clearValidators();
      checkboxCtrl.setValue(false);
    }
    checkboxCtrl.updateValueAndValidity();
  });


}

tipoInscripcion(tipo: string): number {
  switch (tipo.toLowerCase()) {
    case 'cadete':
      this.edadMaxima=24;
      return 1;
    case 'suboficial':
      this.edadMaxima=34;
      return 2;
    case 'profesional':
      this.edadMaxima=99;
      return 3;
    default:
      return 1;
  }
}


ObservacionesGroup = this._formBuilder.group({
  observaciones:[''],
})

InicialFormGroup = this._formBuilder.group({
  nombre: ['', Validators.required],
  apellido: ['', Validators.required],
  mail: ['', [Validators.required, Validators.email]],
  fechaNac: ['', [Validators.required, this.edadMaximaValidator(), this.edadMinimaValidator()]],
  sexoId: ['', Validators.required],
  estabSolicitudId: [''],
  dni: ['', Validators.required],
  nacionalidadId:['', Validators.required],
  fechaSolicitud: [new Date()],
  nacionalizado: [false]
});




PersonalFormGroup = this._formBuilder.group({
  generoId:['', Validators.required],
  estadoCivilId:['', Validators.required],
  altura:['', Validators.required],
  peso: ['', [
    Validators.required,
    Validators.pattern(/^\d{2,3}$/)
  ]],
  tieneTatuajes:[false],
  cantidadTatuajes:[''],
});

DomicilioFormGroup = this._formBuilder.group({
  calle: ['', Validators.required],
  numero: ['', Validators.required],
  localidadId: ['', Validators.required],
  codigoPostal: ['', Validators.required],
});

///////////////////////////////////////// Contactos form group //////////////////////////////////////////////
ContactosFormGroup = this._formBuilder.group({
  contactos: this._formBuilder.array([this.crearContactosFormGroup()])
});

get contactosFormArray(): FormArray {
  return this.ContactosFormGroup.get('contactos') as FormArray;
}

agregarContacto() {
  this.contactosFormArray.push(this.crearContactosFormGroup());
}

eliminarContacto(index: number) {
  if (this.contactosFormArray.length > 1) {
    this.contactosFormArray.removeAt(index);
  }
}

crearContactosFormGroup(): FormGroup {
  return this._formBuilder.group({
    telefono: ['', Validators.required],
    perteneciente: ['', Validators.required],
  });
}


//////////////////////////// Estudio form group ///////////////////////////////////////////
EstudiosFormGroup = this._formBuilder.group({
  estudios: this._formBuilder.array([this.crearEstudioFormGroup()])
});

get estudiosFormArray() {
  return this.EstudiosFormGroup.get('estudios') as FormArray;
}
agregarEstudio() {
  this.estudiosFormArray.push(this.crearEstudioFormGroup());
}
eliminarEstudio(index: number) {
  if (this.estudiosFormArray.length > 1) {
    this.estudiosFormArray.removeAt(index);
  }
}

crearEstudioFormGroup(): FormGroup {
  return this._formBuilder.group({
    nivelEstudiosId: ['', Validators.required],
    titulo: ['', Validators.required],
    institutoEducativo: ['', Validators.required],
    anoEgreso: ['', Validators.required],
    enCurso: [false]
  });
}

///////////////////////////////////////// Trabajo form group //////////////////////////////////////////////
TrabajoFormGroup = this._formBuilder.group({
  trabajos: this._formBuilder.array([this.crearTrabajoFormGroup()])
});

get trabajosFormArray(): FormArray {
  return this.TrabajoFormGroup.get('trabajos') as FormArray;
}

agregarTrabajo() {
  this.trabajosFormArray.push(this.crearTrabajoFormGroup());
}

eliminarTrabajo(index: number) {
  if (this.trabajosFormArray.length > 1) {
    this.trabajosFormArray.removeAt(index);
  }
}

crearTrabajoFormGroup(): FormGroup {
  return this._formBuilder.group({
    actividadLaboral: [''],
    desde: [''],
    hasta:[''],
    intentoAnterior: [false],
    etapaAlcanzada: [''],
    otraFuerza: [false],
    motivoBaja: ['']
  });
}
/////////////////////////////////////////// Familiares form group /////////////////////////////////////

FamiliarFormGroup = this._formBuilder.group({
  familiares: this._formBuilder.array([this.crearFamiliaresFormGroup()])
});

get familiarFormArray(): FormArray {
  return this.FamiliarFormGroup.get('familiares') as FormArray;
}

agregarFamiliar() {
  this.familiarFormArray.push(this.crearFamiliaresFormGroup());
}

eliminarFamiliar(index: number) {
  if (this.familiarFormArray.length > 1) {
    this.familiarFormArray.removeAt(index);
  }
}
crearFamiliaresFormGroup(): FormGroup {
  return this._formBuilder.group({
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    dni: [Validators.required],
    convive: [false],
    parentescoId: [Validators.required],
    esEmpleado: [false],
    activo: [false]
  });
}


@ViewChild('stepper') stepper!: MatStepper;

verificarYContinuar(): void {



  if (this.InicialFormGroup.invalid) {
    this.InicialFormGroup.markAllAsTouched();
    return;
  }

  this.verificando = true;

  const tipoId = this.tipoInscripcionId;
  const dniControl = this.InicialFormGroup.get('dni');
  const emailControl = this.InicialFormGroup.get('mail');
  const dniString = this.InicialFormGroup.get('dni')?.value ?? "";
  const dni = parseInt(dniString.replace(/\./g, ''), 10);
  const email = emailControl?.value ?? "";

  this.postulanteService.verificarPostulante(dni, tipoId, email).subscribe({
    next: result => {
      setTimeout(() => {  // Simula una demora
      let tieneError = false;

      if (result.existeDni) {
        dniControl?.setErrors({ ...dniControl.errors, existeDni: true });
        tieneError = true;
      }
      if (result.existeEmail) {
        emailControl?.setErrors({ ...emailControl.errors, existeEmail: true });
        tieneError = true;
      }

      if (!tieneError) {
        this.stepper.next();
      }
      this.verificando = false;
    }, 1500); // espera 1.5 segundos
    },
    error: err => console.error('Error al verificar', err)
  });
}

getErrorMessage(formGroup: FormGroup, controlName: string): string {
  const control = formGroup.get(controlName);

  if (control?.hasError('required')) {
    return 'Este campo es obligatorio';
  }
  if (control?.hasError('email')) {
    return 'Ingresa un email válido';
  }
  if (control?.hasError('existeDni')) {
    return 'El DNI ya se encuentra registrado';
  }
  if (control?.hasError('existeEmail')) {
    return 'El email ya se encuentra registrado';
  }
  if (control?.hasError('edadMaxima')) {
    return 'La edad no puede ser mayor a ' + this.edadMaxima + ' años';
  }
  if (control?.hasError('edadMinima') ){
    return 'La edad no puede ser menor de 18 años';
  }
  return '';
}

edadMaximaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fecha = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();
    const edadExacta = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;

    return edadExacta > this.edadMaxima ? { edadMaxima: true } : null;
  };
}

edadMinimaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fecha = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();
    const edadExacta = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;

    return edadExacta < 18 ? { edadMinima: true } : null;
  };
}


title = 'Postulantes';
imagenRequerida = false;
fileName:string = "";
file: File | null = null;
fileBase64 = '';
fileUrl: SafeResourceUrl | null = null;

 onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const allowed = ['image/jpeg', 'image/png'];
  if (!allowed.includes(file.type)) {
    alert('Sólo JPG o PNG.');
    input.value = ''; // limpia el picker
    return;
  }

  this.file         = file;
  this.fileName     = file.name;
  const reader      = new FileReader();
  reader.onload     = () => {
    this.fileBase64   = (reader.result as string).split(',')[1];   // solo el payload base64
    const dataUrl     = `data:${file.type};base64,${this.fileBase64}`;
    this.fileUrl      = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  };
  reader.readAsDataURL(file);
}

////////////////////////////////// ENVIO DEL FORMULARIO /////////////////////////


EnviarFormulario() {

  if (!this.fileBase64) {
    this.imagenRequerida = true;
    return;
  }

  this.imagenRequerida = false;

  if (this.InicialFormGroup.valid && this.DomicilioFormGroup.valid) {
    this.enviando = true;

// this.InicialFormGroup.value.fechaSolicitud = new Date();
// const fechaRaw = this.InicialFormGroup.value.fechaNac;
// const fechaFormateada = fechaRaw ? new Date(fechaRaw).toISOString().split('T')[0] : null;

    const payload = {
      ...this.InicialFormGroup.value,
      fechaNac: this.formatDateOnly(new Date(this.InicialFormGroup.value.fechaNac ?? "")),
      fechaSolicitud: new Date(),
      datosPersonales: {
        ...this.PersonalFormGroup.value,
        observaciones: this.ObservacionesGroup.value.observaciones
      },
      domicilios: [this.DomicilioFormGroup.value],
      contactos: this.contactosFormArray?.value ?? [],
      familiares: this.familiarFormArray?.value ?? [],
      estudios: this.estudiosFormArray?.value ?? [],
      trabajos: this.trabajosFormArray?.value.map((trabajo: any) => ({
        ...trabajo,
        desde: trabajo.desde ? this.formatDateOnly(trabajo.desde) : null,
        hasta: trabajo.hasta ? this.formatDateOnly(trabajo.hasta) : null
      })),
      seguimiento:{
        EstadoId:1,
        TipoInscripcionId: this.tipoInscripcionId,
        Modify_At: new Date(),
      }
    };

    this.postulanteService.enviarDatos(payload)
      .subscribe({
        next: (response) => {

          const postulanteId = response.postulanteId;
          const formData = new FormData();

          if (this.file) {
            formData.append('postulanteId', postulanteId.toString());
            formData.append('file', this.file, this.file.name);
          }

          // Enviar la imagen al backend
          this.postulanteService.enviarImagen(formData)
            .subscribe({
              next: () => {
                this.enviando = false;
                // Redirigir
                this.router.navigate(['/confirmacion']);
              },
              error: (err) => {
                alert('Ha ocurrido un error al enviar la imagen.');
                this.enviando = false;
                console.log(err);
              }
            });
        },
        error: (err) =>  {
          alert('Ha ocurrido un error en el envio del formulario, por favor intente nuevamente.');
          this.enviando = false;
          console.log(err);
        }
      });
  } else {
    console.log('El formulario tiene errores');
    this.InicialFormGroup.markAllAsTouched();
    this.DomicilioFormGroup.markAllAsTouched();
    this.PersonalFormGroup.markAllAsTouched();
    this.ContactosFormGroup.markAllAsTouched();
    this.EstudiosFormGroup.markAsTouched();
    this.TrabajoFormGroup.markAsTouched();
    this.FamiliarFormGroup.markAsTouched();
    this.ObservacionesGroup.markAsTouched();
  }
};

reloadPage(): void {
  window.location.reload();
}

formatDateOnly(date: Date): string {
  return date ? date.toISOString().split('T')[0] : '';
}



}
