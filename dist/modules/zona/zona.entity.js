var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property } from '@mikro-orm/core';
import { BaseEntityObjeto } from '../../shared/db/base.objeto.entity.js';
export let Zona = class Zona extends BaseEntityObjeto {
    constructor(nombre, esSedeCentral) {
        super();
        this.esSedeCentral = false;
        this.nombre = nombre;
        this.esSedeCentral = esSedeCentral;
    }
    toDTO() {
        return {
            id: this.id,
            nombre: this.nombre,
            esSedeCentral: this.esSedeCentral,
        };
    }
};
__decorate([
    Property(),
    __metadata("design:type", String)
], Zona.prototype, "nombre", void 0);
__decorate([
    Property({ default: false }),
    __metadata("design:type", Boolean)
], Zona.prototype, "esSedeCentral", void 0);
Zona = __decorate([
    Entity({ tableName: 'zonas' }),
    __metadata("design:paramtypes", [String, Boolean])
], Zona);
//# sourceMappingURL=zona.entity.js.map