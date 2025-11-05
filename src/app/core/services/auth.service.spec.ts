import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AuthenticationResponse, AuthService } from './auth.service';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../models/user.model';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;
  const mockedJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthService
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    mockedJwtDecode.mockClear();
    localStorage.clear();
    spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    (service as any).isAuthenticatedSubject.next(false);
    (service as any).logoutReason.next(null);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Testes de login
  it('login() deve fazer POST para /api/auth/login, salvar tokens e emitir true em isAuthenticated$', (done: DoneFn) => {
    // ARRANGE: Dados de teste
    const mockCredentials: LoginRequest = { email: 'test@test.com', password: 'Testpassword' };
    const mockResponse: AuthenticationResponse = { accessToken: 'fakeAccess', refreshToken: 'fakeRefresh' };
    let isAuthenticatedValue:  boolean | undefined;

    // Escuta o observable, verificando o valor emitido
    const sub = service.isAuthenticated$.subscribe(value => {
      isAuthenticatedValue = value;
    });

    // ACT: Chama o método a ser testado
    service.login(mockCredentials).subscribe(response => {
      // ASSERT: Verifica a response do método
      expect(response).toEqual(mockResponse);

      // Verifica se os tokens foram salvos no localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('musclebuilder_access_token', mockResponse.accessToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('musclebuilder_refresh_token', mockResponse.refreshToken);

      // Verifica se o estado de autenticação foi atualizado
      // setTimeout é usado para garantir a emissão assíncrona do BehaviorSubject
      setTimeout(() =>{
        expect(isAuthenticatedValue).toBeTruthy();
        sub.unsubscribe();
        done();
      }, 0);
    });

    // ASSERT Verificando a requisição HTTP
    const req = httpTestingController.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    // Simula a response do servidor
    req.flush(mockResponse);
  });

  it('login() deve retornar erro se a API falhar', (done: DoneFn) => {
    // ARRANGE
    const mockCredentials: LoginRequest = { email: 'test@test.com', password: 'Testpassword' };
    const mockError = { status: 401, statusText: 'Unauthorized' };

    // ACT
    service.login(mockCredentials).subscribe({
      next: () => fail('O login deveria ter falhado com erro 401'),
      error: (error: any) => {
        // ASSERT
        expect(error.status).toBe(401);
        // Confirma que nada foi salvo no localStorage em caso de erro
        expect(localStorage.setItem).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');

    // Simula um response de erro do servidor
    req.flush('Unauthorized', mockError)
  })

  // TESTES DE LOGOUT
  it('logout() deve remover os tokens do localStorage, navegar para /auth e deixa isAuthenticated$ false', () => {
    // ARRANGE: Simula estado inicial de usuário logado
    localStorage.setItem('musclebuilder_access_token', 'fakeAccess');
    localStorage.setItem('musclebuilder_refresh_token', 'fakeRefresh');
    // Força o estado inicial para true
    (service as any).isAuthenticatedSubject.next(true);

    let isAuthenticatedValue: boolean | undefined;
    const sub = service.isAuthenticated$.subscribe(value => {
      isAuthenticatedValue = value
    });
    
    let logoutReasonValue: string | null = null;
    const reasonSub = service.logoutReason$.subscribe(reason => {
      logoutReasonValue = reason;
    });

    // ACT
    service.logout('Test Reason');

    // ASSERT
    expect(localStorage.removeItem).toHaveBeenCalledWith('musclebuilder_access_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('musclebuilder_refresh_token');
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);

    expect(isAuthenticatedValue).toBeFalsy();

    expect(logoutReasonValue!).toEqual('Test Reason');

    sub.unsubscribe();
    reasonSub.unsubscribe();
  })
});
